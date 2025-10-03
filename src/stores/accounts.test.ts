import { webcrypto } from 'node:crypto'
if (!globalThis.crypto) (globalThis as any).crypto = webcrypto
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAccountsStore } from './accounts'

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

describe('accounts store', () => {
  it('adds and removes account', () => {
    const s = useAccountsStore()
    s.addEmpty()
    expect(s.items.length).toBe(1)
    const id = s.items[0].id
    s.remove(id)
    expect(s.items.length).toBe(0)
  })

  it('upserts with LDAP makes password null and parses labels', () => {
    const s = useAccountsStore()
    const id = crypto.randomUUID()
    s.upsert({
      id,
      rawLabel: ' one ; two ',
      type: 'LDAP',
      login: 'user',
      password: 'should_be_ignored'
    })
    const acc = s.items.find(a => a.id === id)!
    expect(acc.password).toBeNull()                
    expect(acc.labels).toEqual([{text: 'one'}, {text: 'two'}]) 
    expect(acc.login).toBe('user')
  })
})
