import json
import os

import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
}


def esc(value: str) -> str:
    return "'" + (value or '').replace("'", "''") + "'"


def handler(event: dict, context) -> dict:
    """Отдаёт список заявок с сайта для админ-панели. Доступ только по паролю в заголовке X-Admin-Password."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': CORS,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    provided = (headers.get('x-admin-password') or '').strip()
    expected = os.environ.get('ADMIN_PASSWORD', '').strip()

    if not expected or provided != expected:
        return {
            'statusCode': 401,
            'headers': CORS,
            'body': json.dumps({'error': 'Неверный пароль'}, ensure_ascii=False),
        }

    params = event.get('queryStringParameters') or {}
    search = ''.join(ch for ch in (params.get('phone') or '') if ch.isdigit())
    if search.startswith('8') or search.startswith('7'):
        search = search[1:]
    search = search[:10]

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    where = ''
    if search:
        where = (
            "WHERE regexp_replace(phone, '[^0-9]', '', 'g') LIKE "
            + esc('%' + search + '%')
        )

    sql = (
        "SELECT id, to_char(created_at AT TIME ZONE 'UTC' + interval '3 hours', 'DD.MM.YYYY HH24:MI') AS created, "
        "name, phone, COALESCE(company, '') AS company, COALESCE(email, '') AS email, "
        "COALESCE(car, '') AS car, COALESCE(service, '') AS service, COALESCE(comment, '') AS comment, "
        "mail_sent "
        f"FROM {schema}.leads {where} ORDER BY id DESC LIMIT 500"
    )

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
    finally:
        conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'leads': rows, 'total': len(rows)}, ensure_ascii=False, default=str),
    }