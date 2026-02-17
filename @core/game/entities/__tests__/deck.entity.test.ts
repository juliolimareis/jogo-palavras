import { describe, it, expect } from 'vitest';
import Deck from '../deck.entity'; 
import Card from '../card.entity';

describe('Deck Entity', () => {
  
  const mockCards = [
    { id: '1', value: 'A' },
    { id: '2', value: 'B' },
    { id: '3', value: 'C' }
  ];

  describe('Inicialização', () => {
    it('deve iniciar um deck vazio se nenhuma props for passada', () => {
      const deck = Deck.create();
      expect(deck.size).toBe(0);
      expect(deck.cards).toEqual([]);
    });

    it('deve converter props de cards em instâncias de Card no constructor', () => {
      const deck = Deck.create({ cards: mockCards });
      expect(deck.size).toBe(3);
      expect(deck.cards[0]).toBeInstanceOf(Card);
      expect(deck.cards[0]?.value).toBe('A');
    });
  });

  describe('Comportamento do Deck (Draw & Add)', () => {
    it('deve remover e retornar a primeira carta ao usar draw()', () => {
      const deck = Deck.create({ cards: [...mockCards] });
      const firstCardValue = deck.cards[0]?.value;
      
      const drawnCard = deck.draw();
      
      expect(drawnCard?.value).toBe(firstCardValue);
      expect(deck.size).toBe(2);
      expect(deck.cards[0]?.value).toBe('B'); // A segunda virou a primeira
    });

    it('deve retornar null ao dar draw() em um deck vazio', () => {
      const deck = Deck.create();
      expect(deck.draw()).toBeNull();
    });

    it('deve adicionar múltiplas cartas corretamente', () => {
      const deck = Deck.create();
      const card1 = Card.create({ id: '10', value: 'X' });
      const card2 = Card.create({ id: '11', value: 'Y' });
      
      deck.addCard(card1, card2);
      
      expect(deck.size).toBe(2);
      expect(deck.cards).toContain(card1);
      expect(deck.cards).toContain(card2);
    });
  });

  describe('Embaralhamento (Shuffle)', () => {
    it('deve alterar a ordem das cartas', () => {
      // Criamos um deck maior para reduzir a chance estatística de a ordem ser igual
      const manyCards = Array.from({ length: 20 }, (_, i) => ({ id: `${i}`, value: `${i}` }));
      const deck = Deck.create({ cards: manyCards });
      const originalOrder = deck.cards.map(c => c.id);

      deck.shuffle();
      const shuffledOrder = deck.cards.map(c => c.id);

      expect(shuffledOrder).not.toEqual(originalOrder);
      expect(shuffledOrder.sort()).toEqual(originalOrder.sort()); // Garante que as cartas são as mesmas
    });
  });

  describe('Persistência (Serialization)', () => {
    it('deve gerar um JSON válido com todas as cartas serializadas', () => {
      const deck = Deck.create({ cards: mockCards });
      const json = deck.toJson();

      expect(json.cards).toHaveLength(3);
      expect(json.cards?.[0]).toHaveProperty('value', 'A');
      // Verifica se o método toJson da Entity base (id) foi chamado
      expect(json.cards?.[0]).toHaveProperty('id', '1');
    });
  });
});