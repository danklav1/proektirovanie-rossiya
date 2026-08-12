import json
import os
import smtplib
from datetime import date, datetime, timedelta
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

TIMES = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00',
]

DAYS_AHEAD = 14

WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
MONTHS = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]


def esc(value: str) -> str:
    return "'" + (value or '').replace("'", "''") + "'"


def today_msk() -> date:
    return (datetime.utcnow() + timedelta(hours=3)).date()


def build_days() -> list:
    start = today_msk()
    days = []
    for i in range(DAYS_AHEAD):
        d = start + timedelta(days=i)
        days.append(
            {
                'date': d.isoformat(),
                'day': d.day,
                'weekday': WEEKDAYS[d.weekday()],
                'month': MONTHS[d.month - 1],
                'closed': d.weekday() == 6,
                'isToday': i == 0,
            }
        )
    return days


def send_mail(data: dict, human_date: str) -> None:
    password = os.environ.get('SMTP_PASSWORD', '').strip()
    if not password:
        raise RuntimeError('SMTP_PASSWORD is not set')

    lines = [
        'Онлайн-запись с сайта Газ-Он',
        '',
        f"Имя: {data['name']}",
        f"Телефон: {data['phone']}",
        f"Услуга: {data.get('service') or '—'}",
        f"Дата и время: {human_date}, {data['time']}",
        f"Центр: {data.get('city') or '—'}",
        f"Адрес: {data.get('address') or '—'}",
        f"Комментарий: {data.get('comment') or '—'}",
    ]

    msg = EmailMessage()
    msg['Subject'] = f"Запись: {data['name']}, {human_date} {data['time']}"
    msg['From'] = formataddr(('Сайт Газ-Он', MAIL_FROM))
    msg['To'] = MAIL_TO
    msg.set_content('\n'.join(lines))

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=20) as smtp:
        smtp.login(MAIL_FROM, password)
        smtp.send_message(msg)


def handler(event: dict, context) -> dict:
    """Онлайн-запись на установку ГБО: отдаёт календарь свободных слотов на 14 дней и принимает бронь."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    dsn = os.environ['DATABASE_URL']

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        city = (params.get('city') or '').strip()

        start = today_msk()
        end = start + timedelta(days=DAYS_AHEAD)
        cond = f"slot_date >= DATE {esc(start.isoformat())} AND slot_date < DATE {esc(end.isoformat())}"
        if city:
            cond += ' AND city = ' + esc(city)

        conn = psycopg2.connect(dsn)
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"SELECT slot_date, slot_time FROM {schema}.bookings "
                    f"WHERE {cond} AND status <> 'declined'"
                )
                taken = {}
                for slot_date, slot_time in cur.fetchall():
                    taken.setdefault(slot_date.isoformat(), []).append(slot_time)
        finally:
            conn.close()

        now = datetime.utcnow() + timedelta(hours=3)
        days = build_days()
        for d in days:
            busy = set(taken.get(d['date'], []))
            if d['isToday']:
                for t in TIMES:
                    hh, mm = t.split(':')
                    if now.hour * 60 + now.minute >= int(hh) * 60 + int(mm) - 60:
                        busy.add(t)
            d['busy'] = sorted(busy)
            d['free'] = 0 if d['closed'] else len([t for t in TIMES if t not in busy])

        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({'days': days, 'times': TIMES}, ensure_ascii=False),
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': CORS,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    body = json.loads(event.get('body') or '{}')
    data = {
        k: (body.get(k) or '').strip()
        for k in ('name', 'phone', 'city', 'address', 'service', 'date', 'time', 'comment')
    }

    if not data['name'] or not data['phone'] or not data['date'] or not data['time']:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps(
                {'success': False, 'error': 'Заполните имя, телефон, дату и время'},
                ensure_ascii=False,
            ),
        }

    try:
        slot = date.fromisoformat(data['date'])
    except ValueError:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps({'success': False, 'error': 'Некорректная дата'}, ensure_ascii=False),
        }

    start = today_msk()
    if slot < start or slot >= start + timedelta(days=DAYS_AHEAD) or slot.weekday() == 6:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps(
                {'success': False, 'error': 'Эта дата недоступна для записи'}, ensure_ascii=False
            ),
        }

    if data['time'] not in TIMES:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps({'success': False, 'error': 'Некорректное время'}, ensure_ascii=False),
        }

    conn = psycopg2.connect(dsn)
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT 1 FROM {schema}.bookings WHERE city = {esc(data['city'])} "
                f"AND slot_date = DATE {esc(data['date'])} AND slot_time = {esc(data['time'])} "
                "AND status <> 'declined'"
            )
            if cur.fetchone():
                return {
                    'statusCode': 409,
                    'headers': CORS,
                    'body': json.dumps(
                        {'success': False, 'error': 'Это время уже заняли — выберите другое'},
                        ensure_ascii=False,
                    ),
                }

            cur.execute(
                f"INSERT INTO {schema}.bookings (name, phone, city, address, service, slot_date, slot_time, comment) "
                f"VALUES ({esc(data['name'])}, {esc(data['phone'])}, {esc(data['city'])}, "
                f"{esc(data['address'])}, {esc(data['service'])}, DATE {esc(data['date'])}, "
                f"{esc(data['time'])}, {esc(data['comment'])})"
            )
        conn.commit()
    finally:
        conn.close()

    human_date = f"{slot.day} {MONTHS[slot.month - 1]}"

    mail_sent = False
    try:
        send_mail(data, human_date)
        mail_sent = True
    except Exception as exc:
        print(f'Booking mail failed: {type(exc).__name__}: {exc}')

    print(f"Booking: {data['name']} / {data['phone']} on {data['date']} {data['time']}")
    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps(
            {'success': True, 'mailSent': mail_sent, 'date': human_date, 'time': data['time']},
            ensure_ascii=False,
        ),
    }
