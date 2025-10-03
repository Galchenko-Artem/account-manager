import { defineStore } from 'pinia'
import type { Account, AccountDraft } from '@/types'
import { parseLabel } from '@/lib/label'

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    items: [] as Account[],
  }),
  persist: { storage: localStorage }, 
  actions: {
    addEmpty() {
      const id = crypto.randomUUID()
      this.items.push({
        id,
        rawLabel: '',
        labels: [],
        type: 'Local',
        login: '',
        password: '',
      })
    },
    remove(id: string) {
      this.items = this.items.filter(i => i.id !== id)
    },
    upsert(draft: AccountDraft) {
      const idx = this.items.findIndex(i => i.id === draft.id)
      const { labels } = parseLabel(draft.rawLabel)
      const password = draft.type === 'LDAP' ? null : (draft.password ?? '')
      const next: Account = {
        id: draft.id,
        rawLabel: draft.rawLabel,
        labels,
        type: draft.type,
        login: draft.login || '',
        password,
      }
      if (idx === -1) this.items.push(next)
      else this.items[idx] = next
    },
  },
})
