export type AccountType = 'LDAP' | 'Local'

export interface LabelItem { text: string }

export interface Account {
  id: string
  labels: LabelItem[]              
  rawLabel: string                
  type: AccountType
  login: string | null
  password: string | null        
}

export interface AccountDraft {
  id: string
  rawLabel: string
  type: AccountType
  login: string
  password?: string | null
}
