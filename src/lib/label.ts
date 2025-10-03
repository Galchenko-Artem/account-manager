export function parseLabel(raw: string): { labels: { text: string }[] } {
  const parts = raw
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 100) 
  return { labels: parts.map(text => ({ text })) }
}
