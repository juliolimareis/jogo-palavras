import { describe, it, expect, beforeEach } from 'vitest'
import DictionaryBrDatabase from '../dictionaryBr.database.driver'

describe('DictionaryBrDatabase', () => {
  let database: DictionaryBrDatabase

  beforeEach(() => {
    database = new DictionaryBrDatabase()
  })

  it('deve retornar true quando a palavra existir no dicionário', () => {
    expect(database.checkWorld('casa')).toBe(true)
    expect(database.checkWorld('bola')).toBe(true)
  })

  it('deve retornar false quando a palavra não existir no dicionário', () => {
    expect(database.checkWorld('Não dese ser válido')).toBe(false)
  })

  it('Não deve ser case-sensitive', () => {
    expect(database.checkWorld('Casa')).toBe(true)
  })

  it('deve retornar false para string vazia', () => {
    expect(database.checkWorld('')).toBe(false)
  })
})
