import { describe, it, expect } from 'vitest';
import Player from './player.entity'; 
import Card from './card.entity';

describe('Player Entity', () => {
  
  const mockCardProps = { id: 'c1', value: 'A', isShield: false };
  const shieldCardProps = { id: 'c2', value: 'Shield', isShield: true };

  describe('Inicialização', () => {
    it('deve criar um jogador com valores padrão', () => {
      const player = Player.create({ name: 'Eduardo' });
      
      expect(player.name).toBe('Eduardo');
      expect(player.isReady).toBe(false);
      expect(player.cards).toHaveLength(0);
      expect(player.isDisabled).toBe(false);
    });

    it('deve carregar cartas iniciais se fornecidas', () => {
      const player = Player.create({ 
        name: 'Bot', 
        cards: [mockCardProps] 
      });

      expect(player.cards).toHaveLength(1);
      expect(player.cards[0]).toBeInstanceOf(Card);
    });
  });

  describe('Gestão de Cartas', () => {
    it('deve adicionar uma ou mais cartas à mão do jogador', () => {
      const player = Player.create({ name: 'Player 1' });
      const card1 = Card.create(mockCardProps);
      const card2 = Card.create(shieldCardProps);

      player.addCard(card1, card2);

      expect(player.cards).toHaveLength(2);
      expect(player.cards).toContain(card1);
    });

    it('deve remover uma carta específica da mão pelo ID', () => {
      const card = Card.create(mockCardProps);
      const player = Player.create({ name: 'Player 1', cards: [card.toJson()] });

      expect(player.cards).toHaveLength(1);
      
      player.removeCard(card);
      
      expect(player.cards).toHaveLength(0);
    });

    it('não deve remover nada se a carta não existir no player', () => {
      const cardInHand = Card.create({ id: 'in-hand', value: 'A' });
      const cardOut = Card.create({ id: 'outside', value: 'B' });
      const player = Player.create({ name: 'P1', cards: [cardInHand.toJson()] });

      player.removeCard(cardOut);
      
      expect(player.cards).toHaveLength(1);
      expect(player.cards[0]?.id).toBe('in-hand');
    });
  });

  describe('Lógica de Jogo (Getters)', () => {
    it('deve retornar true em haveShield se houver ao menos uma carta de escudo', () => {
      const player = Player.create({ name: 'P1' });
      
      expect(player.haveShield).toBe(false);

      player.addCard(Card.create(shieldCardProps));
      expect(player.haveShield).toBe(true);
    });
  });

  describe('Serialização', () => {
    it('deve garantir que o JSON exportado reflete o estado atual', () => {
      const player = Player.create({ name: 'Thiago', isReady: true });
      player.addCard(Card.create(mockCardProps));
      
      const json = player.toJson();

      expect(json.name).toBe('Thiago');
      expect(json.isReady).toBe(true);
      expect(json.cards).toHaveLength(1);
      expect(json.cards?.[0]?.value).toBe('A');
    });
  });
});