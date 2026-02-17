/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import Card from '../card.entity';

describe('Card Entity', () => {
  
  describe('Instanciação e Regras de Negócio', () => {
    it('deve criar um card com valores padrão', () => {
      const props = { id: '1', value: 'A' };
      const card = Card.create(props);

      expect(card.value).toBe('A');
      expect(card.points).toBe(0);
      expect(card.isJoker).toBe(false);
      expect(card.variations).toHaveLength(0);
    });

    it('deve lançar erro se o valor não for fornecido', () => {
      expect(() => Card.create({ id: '1' } as any)).toThrow("Card value is required.");
    });

    it('deve converter corretamente para JSON', () => {
      const props = { id: '1', value: 'B', points: 10 };
      const card = Card.create(props);
      const json = card.toJson();

      expect(json.value).toBe('B');
      expect(json.points).toBe(10);
    });
  });

  describe('Lógica de Variações', () => {
    const variations = [
      { id: 'v1', value: 'Variante 1' },
      { id: 'v2', value: 'Variante 2' }
    ];

    it('deve assumir o valor da variação se uma variationPosition válida for fornecida', () => {
      const card = Card.create({
        id: '1',
        value: 'Original',
        variations: variations,
        variationPosition: 1 // Aponta para 'Variante 2'
      });

      expect(card.variationPosition).toBe(1);
      expect(card.value).toBe('Variante 2');
    });

    it('deve manter o valor original e setar position null se a posição for inválida', () => {
      const card = Card.create({
        id: '1',
        value: 'Original',
        variations: variations,
        variationPosition: 99 // Fora do range
      });

      expect(card.variationPosition).toBeNull();
      expect(card.value).toBe('Original');
    });

    it('deve instanciar variações recursivamente como objetos Card', () => {
      const card = Card.create({
        id: '1',
        value: 'Pai',
        variations: [{ id: '2', value: 'Filho' }]
      });

      expect(card.variations[0]).toBeInstanceOf(Card);
      expect(card.variations[0]?.value).toBe('Filho');
    });
  });

  describe('Setters e Getters', () => {
    it('deve permitir atualizar a variationPosition', () => {
      const card = Card.create({ id: '1', value: 'A' });
      card.variationPosition = 5;
      expect(card.variationPosition).toBe(5);
    });
  });
});