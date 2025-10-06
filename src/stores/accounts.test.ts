import { webcrypto } from 'node:crypto';
if (!globalThis.crypto) (globalThis as any).crypto = webcrypto;
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAccountsStore } from './accounts';

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
});
describe('accounts store', () => {
  it('addEmpty добавляет черновик и remove его удаляет', () => {
    const s = useAccountsStore();
    const id = s.addEmpty();
    expect(s.drafts.length).toBe(1);
    s.remove(id);
    expect(s.drafts.length).toBe(0);
  });
  it('upsert с LDAP делает password=null и парсит метки', () => {
    const s = useAccountsStore();
    const id = crypto.randomUUID();
    const res = s.upsert({
      id,
      rawLabel: ' one ; two ',
      type: 'LDAP',
      login: 'user',
      password: 'ignored',
    });
    expect(res.ok).toBe(true);
    const acc = s.items.find(a => a.id === id)!;
    expect(acc.password).toBeNull();
    expect(acc.labels).toEqual([{ text: 'one' }, { text: 'two' }]);
  });
});
