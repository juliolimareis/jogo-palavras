import { describe, it, expect, beforeEach } from 'vitest'
import DictionaryEnDatabase from '../dictionaryEn.database.driver'

describe('DictionaryBrDatabase', () => {
  let database: DictionaryEnDatabase

  beforeEach(() => {
    database = new DictionaryEnDatabase()
  })

  it('deve retornar true quando a palavra existir no dicionário', () => {
    expect(database.checkWorld('world')).toBe(true)
    expect(database.checkWorld('imagine')).toBe(true)
  })

  it('deve retornar false quando a palavra não existir no dicionário', () => {
    expect(database.checkWorld('Não dese ser válido')).toBe(false)
  })

  it('Não deve ser case-sensitive', () => {
    expect(database.checkWorld('World')).toBe(true)
    expect(database.checkWorld('WORLD')).toBe(true)
  })

  it('deve retornar false para string vazia', () => {
    expect(database.checkWorld('')).toBe(false)
  })
})
