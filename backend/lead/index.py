import json
import os
import smtplib
from email.message import EmailMessage
from email.utils import formataddr

import psycopg2

SMTP_HOST = 'smtp.yandex.ru'
SMTP_PORT = 465
MAIL_FROM = 'ed123ed@yandex.ru'
MAIL_TO = 'ed123ed@yandex.ru'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
}


def esc(value: str) -> str:
    return "'" + (value or '').replace("'", "''") + "'"


def save_lead(fields: dict, mail_sent: bool) -> None:
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    cols = ['name', 'phone', 'email', 'company', 'fleet', 'car', 'service', 'comment']
    values = ', '.join(esc(fields.get(c, '')) for c in cols)
    sql = (
        f"INSERT INTO {schema}.leads (name, phone, email, company, fleet, car, service, comment, mail_sent) "
        f"VALUES ({values}, {'TRUE' if mail_sent else 'FALSE'})"
    )
    conn = psycopg2.connect(dsn)
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
        conn.commit()
    finally:
        conn.close()


def send_mail(fields: dict) -> None:
    password = os.environ.get('SMTP_PASSWORD', '').strip()
    if not password:
        raise RuntimeError('SMTP_PASSWORD is not set')

    is_business = bool(fields.get('company') or fields.get('fleet'))
    title = 'Заявка на КП для автопарка' if is_business else 'Новая заявка с сайта Газ-Он'

    lines = [title, '']
    if fields.get('company'):
        lines.append(f"Компания: {fields['company']}")
    lines.append(f"Имя: {fields['name']}")
    lines.append(f"Телефон: {fields['phone']}")
    if fields.get('email'):
        lines.append(f"E-mail: {fields['email']}")
    if fields.get('fleet'):
        lines.append(f"Размер парка: {fields['fleet']}")
    lines.append(f"Автомобиль: {fields.get('car') or '—'}")
    lines.append(f"Услуга: {fields.get('service') or '—'}")
    lines.append(f"Комментарий: {fields.get('comment') or '—'}")

    prefix = 'КП автопарк' if is_business else 'Заявка с сайта'
    msg = EmailMessage()
    msg['Subject'] = f"{prefix}: {fields.get('company') or fields['name']}, {fields['phone']}"
    msg['From'] = formataddr(('Сайт Газ-Он', MAIL_FROM))
    msg['To'] = MAIL_TO
    if fields.get('email'):
        msg['Reply-To'] = fields['email']
    msg.set_content('\n'.join(lines))

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=20) as smtp:
        smtp.login(MAIL_FROM, password)
        smtp.send_message(msg)


def handler(event: dict, context) -> dict:
    """Принимает заявку с форм сайта Газ-Он: сохраняет её в базу и отправляет на почту компании."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': CORS,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    body = json.loads(event.get('body') or '{}')
    fields = {
        k: (body.get(k) or '').strip()
        for k in ('name', 'phone', 'email', 'company', 'fleet', 'car', 'service', 'comment')
    }

    if not fields['name'] or not fields['phone']:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps({'success': False, 'error': 'Укажите имя и телефон'}, ensure_ascii=False),
        }

    mail_sent = False
    mail_error = ''
    try:
        send_mail(fields)
        mail_sent = True
    except Exception as exc:
        mail_error = f'{type(exc).__name__}: {exc}'
        print(f'Mail send failed: {mail_error}')

    try:
        save_lead(fields, mail_sent)
    except Exception as exc:
        print(f'DB save failed: {type(exc).__name__}: {exc}')
        if not mail_sent:
            return {
                'statusCode': 500,
                'headers': CORS,
                'body': json.dumps(
                    {'success': False, 'error': 'Не удалось принять заявку'}, ensure_ascii=False
                ),
            }

    print(f"Lead accepted: {fields.get('company') or fields['name']} / {fields['phone']}, mail_sent={mail_sent}")
    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'success': True, 'mailSent': mail_sent}, ensure_ascii=False),
    }
