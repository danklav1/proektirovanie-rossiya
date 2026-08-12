import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
}

const Leads = () => {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async (pwd: string, phone = '') => {
    setLoading(true);
    try {
      const url = phone ? `${LEADS_URL}?phone=${encodeURIComponent(phone)}` : LEADS_URL;
      const res = await fetch(url, { headers: { 'X-Admin-Password': pwd } });
      if (res.status === 401) {
        setAuthed(false);
        localStorage.removeItem(STORE_KEY);
        setLoginError('Неверный пароль');
        return;
      }
      const data = await res.json();
      setLeads(data.leads || []);
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

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    load(password.trim());
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(password, search);
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

  return (
    <div className="min-h-screen bg-muted px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl">Заявки с сайта</h1>
            <p className="text-sm text-muted-foreground">Всего показано: {leads.length}</p>
          </div>
          <Button variant="outline" onClick={logout} className="rounded-lg">
            <Icon name="LogOut" size={16} className="mr-2" /> Выйти
          </Button>
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
                load(password, '');
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

        <div className="hidden overflow-hidden rounded-2xl border border-border bg-white lg:block">
          {leads.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  <th className="px-4 py-3 font-display">Дата</th>
                  <th className="px-4 py-3 font-display">Имя</th>
                  <th className="px-4 py-3 font-display">Телефон</th>
                  <th className="px-4 py-3 font-display">Услуга</th>
                  <th className="px-4 py-3 font-display">Комментарий</th>
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
                      <a href={`tel:${l.phone.replace(/\D/g, '')}`} className="text-primary hover:underline">
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leads;
