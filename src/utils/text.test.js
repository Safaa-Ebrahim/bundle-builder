import { describe, it, expect } from 'vitest'
import { splitHighlightTitle } from './text'

describe('splitHighlightTitle', () => {
  it('splits a two-word title into first word and the rest', () => {
    expect(splitHighlightTitle('Cam Unlimited')).toEqual(['Cam', 'Unlimited'])
  })

  it('splits a multi-word title into the first word and the remaining joined words', () => {
    expect(splitHighlightTitle('Wyze Cam Pan v3')).toEqual(['Wyze', 'Cam Pan v3'])
  })

  it('returns an empty string for the rest when the title is a single word', () => {
    expect(splitHighlightTitle('Unlimited')).toEqual(['Unlimited', ''])
  })
})
