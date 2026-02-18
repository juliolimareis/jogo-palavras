import { describe, it, expect } from 'vitest';
import CardFactory from '../card.factory';
import { DeckType } from '../../entities/deck.entity';

describe('CardFactory', () => {

  describe('Criação de Cartas Individuais', () => {
    it('deve criar vogais com as variações e acentuações corretas', () => {
      const vowels = CardFactory.buildVowels();
      const aCard = vowels.find(c => c.value === 'A');

      expect(aCard).toBeDefined();
      expect(aCard?.variations).toHaveLength(3);
      expect(aCard?.variations[0]?.value).toBe('Á');
      expect(aCard?.variations[0]?.points).toBe(3);
    });

    it('deve criar o Coringa (Joker) com valores zerados', () => {
      const joker = CardFactory.buildJoker();
      expect(joker.isJoker).toBe(true);
      expect(joker.value).toBe('?');
      expect(joker.points).toBe(0);
    });

    it('deve criar cartas Japonesas com variações complexas', () => {
      const jpConsonants = CardFactory.buildJaponeseConsonants();
      const kiCard = jpConsonants.find(c => c.value === 'き');

      expect(kiCard).toBeDefined();
      // 'き' tem variações como 'ぎ', 'っき', 'ぎゃ', etc.
      expect(kiCard?.variations.length).toBeGreaterThan(0);
      expect(kiCard?.variations.some(v => v.value === 'ぎゃ')).toBe(true);
    });
  });

  describe('Criação de Deck', () => {
    it('deve gerar um deck com o tamanho proporcional aos parâmetros', () => {
      const deck = CardFactory.createDeck(1, 1, 1, 1, DeckType.PT);

      expect(deck.size).toBe(26);
    });

    it('deve gerar um deck japonês quando o tipo for JP', () => {
      const deck = CardFactory.createDeck(1, 0, 0, 0, DeckType.JP);
      const firstCard = deck.draw();
      const lastCard = deck.cards[deck.size -1];
      
      expect("あ").toContain(firstCard?.value);
      expect("お").toContain(lastCard);
    });
  });
});