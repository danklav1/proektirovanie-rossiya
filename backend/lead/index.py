import json
import os
import smtplib
from email.message import EmailMessage
from email.utils import formataddr

SMTP_HOST = 'smtp.yandex.ru'
SMTP_PORT = 465
MAIL_FROM = 'ed123ed@yandex.ru'
MAIL_TO = 'ed123ed@yandex.ru'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
}


def handler(event: dict, context) -> dict:
    """Принимает заявку с форм сайта Газ-Он и отправляет её на почту компании ed123ed@yandex.ru."""
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
    company = (body.get('company') or '').strip()
    email = (body.get('email') or '').strip()
    fleet = (body.get('fleet') or '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps({'success': False, 'error': 'Укажите имя и телефон'}, ensure_ascii=False),
        }

    password = os.environ.get('SMTP_PASSWORD', '').strip()
    if not password:
        print('SMTP_PASSWORD is not set')
        return {
            'statusCode': 500,
            'headers': CORS,
            'body': json.dumps({'success': False, 'error': 'Почта не настроена'}, ensure_ascii=False),
        }

    is_business = bool(company or fleet)
    title = 'Заявка на КП для автопарка' if is_business else 'Новая заявка с сайта Газ-Он'

    lines = [title, '']
    if company:
        lines.append(f'Компания: {company}')
    lines.append(f'Имя: {name}')
    lines.append(f'Телефон: {phone}')
    if email:
        lines.append(f'E-mail: {email}')
    if fleet:
        lines.append(f'Размер парка: {fleet}')
    lines.append(f'Автомобиль: {car or "—"}')
    lines.append(f'Услуга: {service or "—"}')
    lines.append(f'Комментарий: {comment or "—"}')

    subject_prefix = 'КП автопарк' if is_business else 'Заявка с сайта'
    msg = EmailMessage()
    msg['Subject'] = f'{subject_prefix}: {company or name}, {phone}'
    msg['From'] = formataddr(('Сайт Газ-Он', MAIL_FROM))
    msg['To'] = MAIL_TO
    if email:
        msg['Reply-To'] = email
    msg.set_content('\n'.join(lines))

    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=20) as smtp:
            smtp.login(MAIL_FROM, password)
            smtp.send_message(msg)
    except smtplib.SMTPAuthenticationError as exc:
        print(f'SMTP auth failed: {exc}')
        return {
            'statusCode': 500,
            'headers': CORS,
            'body': json.dumps(
                {'success': False, 'error': 'Почта отклонила пароль. Нужен пароль приложения Яндекса.'},
                ensure_ascii=False,
            ),
        }
    except Exception as exc:
        print(f'SMTP send failed: {type(exc).__name__}: {exc}')
        return {
            'statusCode': 500,
            'headers': CORS,
            'body': json.dumps({'success': False, 'error': 'Не удалось отправить письмо'}, ensure_ascii=False),
        }

    print(f'Lead sent to {MAIL_TO}: {company or name} / {phone}')
    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'success': True}, ensure_ascii=False),
    }
