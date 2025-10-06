import { describe, it, expect } from 'vitest';
import { parseLabel } from './label';

describe('parseLabel', () => {
  it('split + trim', () => {
    expect(parseLabel(' a ; b;; c ')).toEqual([{text:'a'},{text:'b'},{text:'c'}]);
  });
});
