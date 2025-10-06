export interface LabelObj { text: string }

export function parseLabel(raw: string): LabelObj[] {
  return raw
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .map(text => ({ text }));
}
