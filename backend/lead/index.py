import json
import os
import smtplib
from email.message import EmailMessage

SMTP_HOST = 'smtp.yandex.ru'
SMTP_PORT = 465
MAIL_FROM = 'ed123ed@yandex.ru'
MAIL_TO = 'ed123ed@yandex.ru'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
}


def handler(event: dict, context) -> dict:
    """Принимает заявку с формы записи на сайте Газ-Он и отправляет её на почту компании."""
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
    name = (body.get('name') or '').strip()
    phone = (body.get('phone') or '').strip()
    car = (body.get('car') or '').strip()
    service = (body.get('service') or '').strip()
    comment = (body.get('comment') or '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps({'success': False, 'error': 'Укажите имя и телефон'}, ensure_ascii=False),
        }

    password = os.environ.get('SMTP_PASSWORD')
    if not password:
        return {
            'statusCode': 500,
            'headers': CORS,
            'body': json.dumps({'success': False, 'error': 'Почта не настроена'}, ensure_ascii=False),
        }

    lines = [
        'Новая заявка с сайта Газ-Он',
        '',
        f'Имя: {name}',
        f'Телефон: {phone}',
        f'Автомобиль: {car or "—"}',
        f'Услуга: {service or "—"}',
        f'Комментарий: {comment or "—"}',
    ]

    msg = EmailMessage()
    msg['Subject'] = f'Заявка с сайта: {name}, {phone}'
    msg['From'] = MAIL_FROM
    msg['To'] = MAIL_TO
    msg.set_content('\n'.join(lines))

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=15) as smtp:
        smtp.login(MAIL_FROM, password)
        smtp.send_message(msg)

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'success': True}, ensure_ascii=False),
    }
