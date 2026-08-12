import json
import os
from datetime import datetime, timedelta

import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
}

STATUSES = ('new', 'in_work', 'booked', 'declined')

WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']


def today_msk():
    return (datetime.utcnow() + timedelta(hours=3)).date()


def esc(value: str) -> str:
    return "'" + (value or '').replace("'", "''") + "'"


def unauthorized() -> dict:
    return {
        'statusCode': 401,
        'headers': CORS,
        'body': json.dumps({'error': 'Неверный пароль'}, ensure_ascii=False),
    }


def handler(event: dict, context) -> dict:
    """Список заявок с сайта и смена их статуса. Доступ только по паролю в заголовке X-Admin-Password."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    if method not in ('GET', 'POST'):
        return {
            'statusCode': 405,
            'headers': CORS,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    provided = (headers.get('x-admin-password') or '').strip()
    expected = os.environ.get('ADMIN_PASSWORD', '').strip()

    if not expected or provided != expected:
        return unauthorized()

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])

    try:
        if method == 'POST':
            body = json.loads(event.get('body') or '{}')

            if body.get('kind') == 'booking':
                booking_id = body.get('id')
                status = (body.get('status') or '').strip()
                if not isinstance(booking_id, int) or status not in ('new', 'declined'):
                    return {
                        'statusCode': 400,
                        'headers': CORS,
                        'body': json.dumps({'error': 'Некорректные данные'}, ensure_ascii=False),
                    }
                with conn.cursor() as cur:
                    cur.execute(
                        f"UPDATE {schema}.bookings SET status = {esc(status)} WHERE id = {booking_id}"
                    )
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': CORS,
                    'body': json.dumps({'success': True, 'id': booking_id, 'status': status}),
                }

            lead_id = body.get('id')
            status = (body.get('status') or '').strip()

            if not isinstance(lead_id, int) or status not in STATUSES:
                return {
                    'statusCode': 400,
                    'headers': CORS,
                    'body': json.dumps({'error': 'Некорректные данные'}, ensure_ascii=False),
                }

            with conn.cursor() as cur:
                cur.execute(
                    f"UPDATE {schema}.leads SET status = {esc(status)} WHERE id = {lead_id}"
                )
            conn.commit()
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({'success': True, 'id': lead_id, 'status': status}),
            }

        params = event.get('queryStringParameters') or {}

        if (params.get('kind') or '') == 'bookings':
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, slot_date, slot_time, city, address, service, name, phone, "
                    "COALESCE(comment, '') AS comment, status, created_at "
                    f"FROM {schema}.bookings ORDER BY slot_date DESC, slot_time DESC LIMIT 500"
                )
                cols = [d[0] for d in cur.description]
                items = []
                for r in cur.fetchall():
                    row = dict(zip(cols, r))
                    slot = row.pop('slot_date')
                    row['date'] = slot.isoformat()
                    row['dateHuman'] = f"{slot.day:02d}.{slot.month:02d}.{slot.year}"
                    row['weekday'] = WEEKDAYS[slot.weekday()]
                    row['past'] = slot < today_msk()
                    created = row.pop('created_at', None)
                    row['created'] = (
                        (created + timedelta(hours=3)).strftime('%d.%m.%Y %H:%M') if created else ''
                    )
                    items.append(row)

                cur.execute(
                    f"SELECT COUNT(*) FROM {schema}.bookings "
                    f"WHERE status <> 'declined' AND slot_date >= DATE {esc(today_msk().isoformat())}"
                )
                upcoming = cur.fetchone()[0]

            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps(
                    {'bookings': items, 'upcoming': upcoming}, ensure_ascii=False, default=str
                ),
            }

        search = ''.join(ch for ch in (params.get('phone') or '') if ch.isdigit())
        if search.startswith('8') or search.startswith('7'):
            search = search[1:]
        search = search[:10]
        status_filter = (params.get('status') or '').strip()

        conds = []
        if search:
            conds.append(
                "regexp_replace(phone, '[^0-9]', '', 'g') LIKE " + esc('%' + search + '%')
            )
        if status_filter in STATUSES:
            conds.append('status = ' + esc(status_filter))
        where = ('WHERE ' + ' AND '.join(conds)) if conds else ''

        sql = (
            "SELECT id, created_at, "
            "name, phone, COALESCE(company, '') AS company, COALESCE(email, '') AS email, "
            "COALESCE(car, '') AS car, COALESCE(service, '') AS service, COALESCE(comment, '') AS comment, "
            "mail_sent, status "
            f"FROM {schema}.leads {where} ORDER BY id DESC LIMIT 500"
        )

        with conn.cursor() as cur:
            cur.execute(sql)
            cols = [d[0] for d in cur.description]
            rows = []
            for r in cur.fetchall():
                row = dict(zip(cols, r))
                created = row.pop('created_at', None)
                if created is not None:
                    moscow = created + timedelta(hours=3)
                    row['created'] = moscow.strftime('%d.%m.%Y %H:%M')
                else:
                    row['created'] = ''
                rows.append(row)

            cur.execute(f"SELECT status, COUNT(*) FROM {schema}.leads GROUP BY status")
            counts = {r[0]: r[1] for r in cur.fetchall()}
    finally:
        conn.close()

    counts['all'] = sum(counts.values())

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps(
            {'leads': rows, 'total': len(rows), 'counts': counts}, ensure_ascii=False, default=str
        ),
    }