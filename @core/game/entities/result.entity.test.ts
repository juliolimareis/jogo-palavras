import { describe, it, expect } from 'vitest';
import Result, { ResultError } from './result.entity'; // Ajuste o caminho
import Player from './player.entity';
import Card, { type CardProps } from './card.entity';

describe('Result Entity', () => {
  
  const mockPlayerProps = { id: 'p1', name: 'Thiago' };
  const mockCardsProps = [
    { id: 'c1', value: 'C', points: 10 },
    { id: 'c2', value: 'A', points: 5 },
    { id: 'c3', value: 'S', points: 5 },
    { id: 'c4', value: 'A', points: 5 },
  ] as CardProps[];

  describe('Validação e Instanciação', () => {
    it('deve lançar ResultError se o player não for fornecido', () => {
      expect(() => Result.create({ cards: [] }))
        .toThrow(ResultError);
    });

    it('deve criar uma instância válida de Result', () => {
      const result = Result.create({
        player: mockPlayerProps,
        cards: mockCardsProps,
        hasAttacked: true
      });

      expect(result.player).toBeInstanceOf(Player);
      expect(result.cards).toHaveLength(4);
      expect(result.cards[0]).toBeInstanceOf(Card);
      expect(result.hasAttacked).toBe(true);
    });
  });

  describe('Lógica de Negócio (Getters)', () => {
    it('deve calcular o score total somando os pontos das cartas', () => {
      const result = Result.create({
        player: mockPlayerProps,
        cards: mockCardsProps // 10 + 5 + 5 + 5 = 25
      });

      expect(result.score).toBe(25);
    });

    it('deve retornar score 0 se não houver cartas', () => {
      const result = Result.create({ player: mockPlayerProps, cards: [] });
      expect(result.score).toBe(0);
    });

    it('deve montar a palavra corretamente unindo os valores das cartas', () => {
      const result = Result.create({
        player: mockPlayerProps,
        cards: mockCardsProps
      });

      expect(result.word).toBe('CASA');
    });

    it('deve retornar uma string vazia para word se não houver cartas', () => {
      const result = Result.create({ player: mockPlayerProps });
      expect(result.word).toBe('');
    });
  });

  describe('Serialização', () => {
    it('deve exportar para JSON mantendo a integridade dos dados aninhados', () => {
      const result = Result.create({
        id: 'res-1',
        player: mockPlayerProps,
        cards: [mockCardsProps[0] as CardProps],
        hasAttacked: false
      });

      const json = result.toJson();

      expect(json.id).toBe('res-1');
      expect(json.player?.name).toBe('Thiago');
      expect(json.cards?.[0]?.value).toBe('C');
      expect(json.hasAttacked).toBe(false);
    });
  });
});