import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  STATUS_LIST,
  StatusPicker,
  type LeadStatusValue,
} from '@/components/leads/LeadStatus';

const LEADS_URL = 'https://functions.poehali.dev/363e7f9a-b9be-4085-a362-c9b8bdf14c5c';
const STORE_KEY = 'gazon_admin_pwd';

interface Lead {
  id: number;
  created: string;
  name: string;
  phone: string;
  company: string;
  email: string;
  car: string;
  service: string;
  comment: string;
  mail_sent: boolean;
  status: LeadStatusValue;
}

type Counts = Record<string, number>;

const Leads = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<Counts>({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | LeadStatusValue>('all');
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = async (pwd: string, phone = '', status: 'all' | LeadStatusValue = 'all') => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (phone) q.set('phone', phone);
      if (status !== 'all') q.set('status', status);
      const url = q.toString() ? `${LEADS_URL}?${q}` : LEADS_URL;
      const res = await fetch(url, { headers: { 'X-Admin-Password': pwd } });
      if (res.status === 401) {
        setAuthed(false);
        localStorage.removeItem(STORE_KEY);
        setLoginError('Неверный пароль');
        return;
      }
      const data = await res.json();
      setLeads(data.leads || []);
      setCounts(data.counts || {});
      setAuthed(true);
      setLoginError('');
      localStorage.setItem(STORE_KEY, pwd);
    } catch {
      setLoginError('Не удалось загрузить заявки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      setPassword(saved);
      load(saved);
    }
  }, []);

  const changeStatus = async (lead: Lead, status: LeadStatusValue) => {
    const prev = lead.status;
    setSavingId(lead.id);
    setLeads((list) => list.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    setCounts((c) => ({
      ...c,
      [prev]: Math.max(0, (c[prev] || 1) - 1),
      [status]: (c[status] || 0) + 1,
    }));
    try {
      const res = await fetch(LEADS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': password },
        body: JSON.stringify({ id: lead.id, status }),
      });
      if (!res.ok) throw new Error('fail');
      if (filter !== 'all' && filter !== status) {
        setLeads((list) => list.filter((l) => l.id !== lead.id));
      }
    } catch {
      setLeads((list) => list.map((l) => (l.id === lead.id ? { ...l, status: prev } : l)));
      toast({ variant: 'destructive', title: 'Не удалось сохранить статус' });
    } finally {
      setSavingId(null);
    }
  };

  const applyFilter = (status: 'all' | LeadStatusValue) => {
    setFilter(status);
    load(password, search, status);
  };

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    load(password.trim());
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(password, search, filter);
  };

  const logout = () => {
    localStorage.removeItem(STORE_KEY);
    setAuthed(false);
    setPassword('');
    setLeads([]);
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        <form
          onSubmit={onLogin}
          className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Icon name="Lock" size={20} />
            </span>
            <div>
              <h1 className="font-display text-xl">Заявки с сайта</h1>
              <p className="text-xs text-muted-foreground">Доступ по паролю</p>
            </div>
          </div>

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="h-12 rounded-lg"
            autoFocus
          />
          {loginError && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
              <Icon name="TriangleAlert" size={13} /> {loginError}
            </p>
          )}

          <Button type="submit" size="lg" disabled={loading} className="mt-4 h-12 w-full rounded-lg">
            {loading ? 'Проверяем…' : 'Войти'}
          </Button>
        </form>
      </div>
    );
  }

  const tabs: { value: 'all' | LeadStatusValue; label: string }[] = [
    { value: 'all', label: 'Все' },
    ...STATUS_LIST.map((s) => ({ value: s.value, label: s.label })),
  ];

  return (
    <div className="min-h-screen bg-muted px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl">Заявки с сайта</h1>
            <p className="text-sm text-muted-foreground">Показано: {leads.length}</p>
          </div>
          <Button variant="outline" onClick={logout} className="rounded-lg">
            <Icon name="LogOut" size={16} className="mr-2" /> Выйти
          </Button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {tabs.map((t) => {
            const active = filter === t.value;
            const count = counts[t.value] ?? 0;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => applyFilter(t.value)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-white text-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {t.label}
                <span className={active ? 'ml-2 opacity-80' : 'ml-2 text-muted-foreground'}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <form onSubmit={onSearch} className="mb-5 flex flex-wrap gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по телефону, например 9001234567"
            inputMode="tel"
            className="h-12 max-w-sm flex-1 rounded-lg bg-white"
          />
          <Button type="submit" disabled={loading} className="h-12 rounded-lg px-6">
            <Icon name="Search" size={16} className="mr-2" /> Найти
          </Button>
          {search && (
            <Button
              type="button"
              variant="ghost"
              className="h-12 rounded-lg"
              onClick={() => {
                setSearch('');
                load(password, '', filter);
              }}
            >
              Сбросить
            </Button>
          )}
        </form>

        {loading && <p className="text-sm text-muted-foreground">Загружаем…</p>}

        {!loading && leads.length === 0 && (
          <div className="rounded-2xl border border-border bg-white p-10 text-center">
            <Icon name="Inbox" size={32} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">Заявок не найдено</p>
          </div>
        )}

        {leads.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-white lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  <th className="px-4 py-3 font-display">Дата</th>
                  <th className="px-4 py-3 font-display">Имя</th>
                  <th className="px-4 py-3 font-display">Телефон</th>
                  <th className="px-4 py-3 font-display">Услуга</th>
                  <th className="px-4 py-3 font-display">Комментарий</th>
                  <th className="px-4 py-3 font-display">Статус</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t border-border align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{l.created}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{l.name}</span>
                      {l.company && (
                        <span className="block text-xs text-muted-foreground">{l.company}</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <a
                        href={`tel:${l.phone.replace(/\D/g, '')}`}
                        className="text-primary hover:underline"
                      >
                        {l.phone}
                      </a>
                      {l.email && (
                        <span className="block text-xs text-muted-foreground">{l.email}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {l.service || '—'}
                      {l.car && <span className="block text-xs text-muted-foreground">{l.car}</span>}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-muted-foreground">{l.comment || '—'}</td>
                    <td className="px-4 py-3">
                      <StatusPicker
                        value={l.status}
                        saving={savingId === l.id}
                        onChange={(s) => changeStatus(l, s)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="space-y-3 lg:hidden">
          {leads.map((l) => (
            <div key={l.id} className="rounded-2xl border border-border bg-white p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-display text-base">{l.name}</span>
                <span className="text-xs text-muted-foreground">{l.created}</span>
              </div>
              {l.company && <p className="mb-1 text-sm text-muted-foreground">{l.company}</p>}
              <a
                href={`tel:${l.phone.replace(/\D/g, '')}`}
                className="block font-display text-lg text-primary"
              >
                {l.phone}
              </a>
              {l.email && <p className="text-sm text-muted-foreground">{l.email}</p>}
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">Услуга: </span>
                {l.service || '—'}
              </p>
              {l.car && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Авто: </span>
                  {l.car}
                </p>
              )}
              {l.comment && <p className="mt-2 text-sm text-muted-foreground">{l.comment}</p>}
              <div className="mt-3 border-t border-border pt-3">
                <StatusPicker
                  value={l.status}
                  saving={savingId === l.id}
                  onChange={(s) => changeStatus(l, s)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leads;
