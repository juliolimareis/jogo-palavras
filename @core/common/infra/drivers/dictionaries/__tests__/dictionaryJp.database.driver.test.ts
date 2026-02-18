import { describe, it, expect, beforeEach } from 'vitest'
import DictionaryJpDatabase from '../dictionaryJp.database.driver'

describe('DictionaryBrDatabase', () => {
  let database: DictionaryJpDatabase

  beforeEach(() => {
    database = new DictionaryJpDatabase()
  })

  it('deve retornar true quando a palavra existir no dicionário', () => {
    expect(database.checkWorld('サ行変格')).toBe(true)
    expect(database.checkWorld('かばん')).toBe(true)
  })

  it('deve retornar false quando a palavra não existir no dicionário', () => {
    expect(database.checkWorld('Não dese ser válido')).toBe(false)
  })

  it('Não deve ser case-sensitive', () => {
    expect(database.checkWorld('サ行変格')).toBe(true)
  })

  it('deve retornar false para string vazia', () => {
    expect(database.checkWorld('')).toBe(false)
  })
})
