import json
import os

import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
}

STATUSES = ('new', 'in_work', 'booked', 'declined')


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
            "SELECT id, to_char(created_at AT TIME ZONE 'UTC' + interval '3 hours', 'DD.MM.YYYY HH24:MI') AS created, "
            "name, phone, COALESCE(company, '') AS company, COALESCE(email, '') AS email, "
            "COALESCE(car, '') AS car, COALESCE(service, '') AS service, COALESCE(comment, '') AS comment, "
            "mail_sent, status "
            f"FROM {schema}.leads {where} ORDER BY id DESC LIMIT 500"
        )

        with conn.cursor() as cur:
            cur.execute(sql)
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]

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
