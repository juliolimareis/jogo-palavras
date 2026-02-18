// test/unit/entity.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Entity, { EntityError, type EntityProps } from './entity'

class TestEntity extends Entity {
  static override create(props?: EntityProps) {
    return new TestEntity(props)
  }
}

describe('Entity', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
  })

  it('deve criar com valores padrão quando props não são informadas', () => {
    const entity = new TestEntity()

    expect(entity.id).toBe('')
    expect(entity.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'))
    expect(entity.updatedAt).toEqual(entity.createdAt)
  })

  it('deve usar valores informados nas props', () => {
    const createdAt = new Date('2023-01-01T00:00:00Z')
    const updatedAt = new Date('2023-02-19T13:52:05Z')

    const entity = new TestEntity({
      id: '123',
      createdAt,
      updatedAt
    })

    expect(entity.id).toBe('123')
    expect(entity.createdAt).toEqual(createdAt)
    expect(entity.updatedAt).toEqual(updatedAt)
  })

  it('deve atualizar updatedAt ao chamar touch()', () => {
    const entity = new TestEntity()

    const newDate = new Date('2024-01-02T00:00:00Z')
    vi.setSystemTime(newDate)

    entity.touch()

    expect(entity.updatedAt).toEqual(newDate)
  })

  it('toJson deve retornar os dados corretamente', () => {
    const date = new Date('2023-05-05T00:00:00Z')

    const entity = new TestEntity({
      id: 'abc',
      createdAt: date,
      updatedAt: date
    })

    const json = entity.toJson()

    expect(json).toEqual({
      id: 'abc',
      createdAt: date,
      updatedAt: date
    })
  })

  it('deve lançar erro ao chamar create da classe base', () => {
    expect(() => {
      Entity.create()
    }).toThrow(EntityError)

    expect(() => {
      Entity.create()
    }).toThrow('Method not implemented.')
  })
})
