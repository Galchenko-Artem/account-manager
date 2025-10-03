import { describe, it, expect } from 'vitest'
import { parseLabel } from './label'

describe('parseLabel', () => {
  it('splits by semicolon and trims', () => {
    const { labels } = parseLabel(' a ; b;; c ')
    expect(labels).toEqual([{text:'a'}, {text:'b'}, {text:'c'}])
  })
})
