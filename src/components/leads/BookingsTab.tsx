import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const LEADS_URL = 'https://functions.poehali.dev/363e7f9a-b9be-4085-a362-c9b8bdf14c5c';

interface Booking {
  id: number;
  date: string;
  dateHuman: string;
  weekday: string;
  slot_time: string;
  city: string;
  address: string;
  service: string;
  name: string;
  phone: string;
  comment: string;
  status: string;
  created: string;
  past: boolean;
}

const BookingsTab = ({ password }: { password: string }) => {
  const { toast } = useToast();
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [showPast, setShowPast] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${LEADS_URL}?kind=bookings`, {
        headers: { 'X-Admin-Password': password },
      });
      const data = await res.json();
      setItems(data.bookings || []);
    } catch {
      toast({ variant: 'destructive', title: 'Не удалось загрузить записи' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (b: Booking, status: 'new' | 'declined') => {
    const prev = b.status;
    setSavingId(b.id);
    setItems((list) => list.map((x) => (x.id === b.id ? { ...x, status } : x)));
    try {
      const res = await fetch(LEADS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': password },
        body: JSON.stringify({ kind: 'booking', id: b.id, status }),
      });
      if (!res.ok) throw new Error('fail');
      toast({
        title: status === 'declined' ? 'Запись отменена' : 'Запись восстановлена',
        description: `${b.name}, ${b.dateHuman} в ${b.slot_time}`,
      });
    } catch {
      setItems((list) => list.map((x) => (x.id === b.id ? { ...x, status: prev } : x)));
      toast({ variant: 'destructive', title: 'Не удалось изменить запись' });
    } finally {
      setSavingId(null);
    }
  };

  const visible = showPast ? items : items.filter((b) => !b.past);

  if (loading) return <p className="text-sm text-muted-foreground">Загружаем записи…</p>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Показано записей: {visible.length}</p>
        <Button variant="outline" className="rounded-lg" onClick={() => setShowPast((v) => !v)}>
          <Icon name="History" size={16} className="mr-2" />
          {showPast ? 'Только предстоящие' : 'Показать прошедшие'}
        </Button>
      </div>

      {visible.length === 0 && (
        <div className="rounded-2xl border border-border bg-white p-10 text-center">
          <Icon name="CalendarDays" size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Записей пока нет</p>
        </div>
      )}

      {visible.length > 0 && (
        <div className="hidden overflow-hidden rounded-2xl border border-border bg-white lg:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr>
                <th className="px-4 py-3 font-display">Дата и время</th>
                <th className="px-4 py-3 font-display">Город</th>
                <th className="px-4 py-3 font-display">Услуга</th>
                <th className="px-4 py-3 font-display">Клиент</th>
                <th className="px-4 py-3 font-display">Телефон</th>
                <th className="px-4 py-3 font-display" />
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => {
                const cancelled = b.status === 'declined';
                return (
                  <tr
                    key={b.id}
                    className={`border-t border-border align-top ${cancelled ? 'opacity-55' : ''}`}
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="font-display text-base">{b.slot_time}</span>
                      <span className="block text-xs text-muted-foreground">
                        {b.weekday}, {b.dateHuman}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {b.city}
                      <span className="block text-xs text-muted-foreground">{b.address}</span>
                    </td>
                    <td className="max-w-[220px] px-4 py-3">
                      {b.service || '—'}
                      {b.comment && (
                        <span className="block text-xs text-muted-foreground">{b.comment}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cancelled ? 'line-through' : 'font-medium'}>{b.name}</span>
                      {cancelled && (
                        <span className="block text-xs text-destructive">отменена</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <a
                        href={`tel:${b.phone.replace(/\D/g, '')}`}
                        className="text-primary hover:underline"
                      >
                        {b.phone}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Button
                        variant={cancelled ? 'outline' : 'ghost'}
                        size="sm"
                        disabled={savingId === b.id}
                        onClick={() => setStatus(b, cancelled ? 'new' : 'declined')}
                        className={`rounded-lg ${cancelled ? '' : 'text-destructive hover:text-destructive'}`}
                      >
                        <Icon name={cancelled ? 'RotateCcw' : 'X'} size={15} className="mr-1.5" />
                        {cancelled ? 'Вернуть' : 'Отменить'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-3 lg:hidden">
        {visible.map((b) => {
          const cancelled = b.status === 'declined';
          return (
            <div
              key={b.id}
              className={`rounded-2xl border border-border bg-white p-4 ${cancelled ? 'opacity-60' : ''}`}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-display text-lg">
                  {b.slot_time} · {b.dateHuman}
                </span>
                <span className="text-xs text-muted-foreground">{b.weekday}</span>
              </div>
              <p className={`font-medium ${cancelled ? 'line-through' : ''}`}>{b.name}</p>
              <a
                href={`tel:${b.phone.replace(/\D/g, '')}`}
                className="block font-display text-lg text-primary"
              >
                {b.phone}
              </a>
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">Услуга: </span>
                {b.service || '—'}
              </p>
              <p className="text-sm text-muted-foreground">
                {b.city}, {b.address}
              </p>
              {b.comment && <p className="mt-2 text-sm text-muted-foreground">{b.comment}</p>}
              <Button
                variant={cancelled ? 'outline' : 'ghost'}
                disabled={savingId === b.id}
                onClick={() => setStatus(b, cancelled ? 'new' : 'declined')}
                className={`mt-3 h-11 w-full rounded-lg ${cancelled ? '' : 'text-destructive hover:text-destructive'}`}
              >
                <Icon name={cancelled ? 'RotateCcw' : 'X'} size={16} className="mr-2" />
                {cancelled ? 'Вернуть запись' : 'Отменить запись'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingsTab;
