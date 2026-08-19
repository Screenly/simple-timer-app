import '@screenly/edge-apps/test'
import { describe, expect, test } from 'bun:test'
import { DEFAULT_MODE, resolveMode } from './mode'

describe('resolveMode', () => {
  test('returns known modes exactly', () => {
    expect(resolveMode('ring')).toBe('ring')
    expect(resolveMode('digits')).toBe('digits')
  })

  test('normalises casing and whitespace', () => {
    expect(resolveMode('  Digits ')).toBe('digits')
    expect(resolveMode('RING')).toBe('ring')
  })

  test('falls back to the default for unknown values', () => {
    expect(resolveMode('huge')).toBe(DEFAULT_MODE)
    expect(resolveMode('')).toBe(DEFAULT_MODE)
    expect(resolveMode(undefined)).toBe(DEFAULT_MODE)
  })
})
