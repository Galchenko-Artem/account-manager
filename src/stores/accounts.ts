import { defineStore } from 'pinia';
import type { _GettersTree as GettersTree } from 'pinia';
import { parseLabel, type LabelObj } from '@/lib/label';
import { MAX_LABEL, MAX_LOGIN, MAX_PASSWORD } from '@/lib/validation';

export type AccountType = 'LDAP' | 'Local';
export interface Account {
  id: string;
  rawLabel: string;
  type: AccountType;
  login: string;
  password: string | null;
  labels: LabelObj[];
}
export interface AccountDraft {
  id: string;
  rawLabel: string;
  type: AccountType;
  login: string;
  password: string;
}

function isDraftValid(d: AccountDraft): boolean {
  if (d.login.trim().length === 0 || d.login.length > MAX_LOGIN) return false;
  if (d.type === 'Local') {
    if (d.password.trim().length === 0 || d.password.length > MAX_PASSWORD) return false;
  }
  if (d.rawLabel.length > MAX_LABEL) return false;
  return true;
}

function toAccount(d: AccountDraft): Account {
  return {
    id: d.id,
    rawLabel: d.rawLabel,
    type: d.type,
    login: d.login,
    password: d.type === 'LDAP' ? null : d.password,
    labels: parseLabel(d.rawLabel),
  };
}

interface State {
  items: Account[];      
  drafts: AccountDraft[];
}

interface Getters extends GettersTree<State> {
  rows(state: State): AccountDraft[];
}

interface Actions {
  addEmpty(): string;
  upsert(payload: AccountDraft): { ok: boolean };
  remove(id: string): void;
}

export const useAccountsStore = defineStore<'accounts', State, Getters, Actions>(
  'accounts',
  {
    state: (): State => ({
      items: [],
      drafts: [],
    }),
    persist: { paths: ['items'] } as any,
    getters: {
      rows(state): AccountDraft[] {
        const fromItems = state.items.map(a => ({
          id: a.id,
          rawLabel: a.rawLabel,
          type: a.type,
          login: a.login,
          password: a.password ?? '',
        }));
        return [...state.drafts, ...fromItems];
      },
    },
    actions: {
      addEmpty(): string {
        const id = crypto.randomUUID();
        this.drafts.push({
          id,
          rawLabel: '',
          type: 'LDAP',
          login: '',
          password: '',
        });
        return id;
      },
      upsert(payload: AccountDraft): { ok: boolean } {
        if (!isDraftValid(payload)) return { ok: false };
        const di = this.drafts.findIndex(d => d.id === payload.id);
        if (di !== -1) this.drafts.splice(di, 1);
        const acc = toAccount(payload);
        const i = this.items.findIndex(a => a.id === acc.id);
        if (i === -1) this.items.push(acc);
        else this.items.splice(i, 1, acc);
        return { ok: true };
      },
      remove(id: string): void {
        const di = this.drafts.findIndex(d => d.id === id);
        if (di !== -1) { this.drafts.splice(di, 1); return; }
        const i = this.items.findIndex(a => a.id === id);
        if (i !== -1) this.items.splice(i, 1);
      },
    },
  }
);
