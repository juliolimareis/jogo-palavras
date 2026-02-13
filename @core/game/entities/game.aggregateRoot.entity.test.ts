/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest';
import { DeckType } from './deck.entity';
import Player from './player.entity';
import GameAggregateRoot, { GameStatus } from './game.aggregateRoot.entity';

describe('GameAggregateRoot', () => {
  let defaultProps: any;

  beforeEach(() => {
    defaultProps = {
      id: 'game-1',
      playerAdmin: { id: 'p1', name: 'Admin' },
      maxPlayers: 4,
      maxRounds: 3,
      roundTimeout: 30,
      type: DeckType.PT,
      players: [{ id: 'p1', name: 'Admin' }, { id: 'p2', name: 'Player 2' }],
      deck: { cards: [] },
      results: []
    };
  });

  describe('Fluxo de Inicialização (Status)', () => {
    it('deve iniciar no status PREPARATION por padrão', () => {
      const game = new GameAggregateRoot(defaultProps);
      expect(game.toJson().status).toBe(GameStatus.PREPARATION);
    });

    it('deve configurar o deck e distribuir cartas ao iniciar o jogo', () => {
      const game = new GameAggregateRoot(defaultProps);
      game.startGame();

      const state = game.toJson();
      expect(state.status).toBe(GameStatus.GAMING);
      expect(state.tableCards).toHaveLength(4); // MAX_TABLE_CARDS
      
      // Cada jogador deve ter 7 cartas + 1 escudo = 8
      expect(state.players[0]?.cards).toHaveLength(8);
      expect(state.results).toHaveLength(1); // Primeira rodada inicializada
    });
  });

  describe('Gestão de Jogadores', () => {
    it('deve permitir adicionar jogadores apenas em PREPARATION', () => {
      const game = new GameAggregateRoot(defaultProps);
      const newPlayer = Player.create({ id: 'p3', name: 'Player 3' });
      
      game.addPlayer(newPlayer);
      expect(game.toJson().players).toHaveLength(3);

      game.startGame();
      game.addPlayer(Player.create({ id: 'p4', name: 'Late' }));
      expect(game.toJson().players).toHaveLength(3); // Não adicionou
    });

    it('deve remover um jogador corretamente', () => {
      const game = new GameAggregateRoot(defaultProps);
      const p2 = Player.create({ id: 'p2', name: 'Player 2' });
      
      game.removePlayer(p2);
      expect(game.toJson().players).toHaveLength(1);
    });
  });

  describe('Lógica de Rodadas', () => {
    it('deve avançar a rodada e distribuir 1 carta extra no RESULT', () => {
      const game = new GameAggregateRoot({
        ...defaultProps,
        status: GameStatus.RESULT,
        round: 1
      });

      game.startNextRound();
      
      const state = game.toJson();

      expect(state.status).toBe(GameStatus.GAMING);
      expect(state.round).toBe(2);
      // Jogadores ganham +1 carta no início da nova rodada
      expect(state.players[0]?.cards?.length).toBeGreaterThan(0);
    });

    it('deve finalizar o jogo ao atingir o limite de rounds', () => {
      const game = GameAggregateRoot.create({
        ...defaultProps,
        status: GameStatus.RESULT,
        round: 3, // maxRounds
        maxRounds: 3
      });

      game.startNextRound();
      expect(game.toJson().status).toBe(GameStatus.FINISHED);
    });
  });

  describe('Regras de Negócio Internas', () => {
    it('deve gerar escudos com 10 pontos', () => {
      const game = new GameAggregateRoot(defaultProps);
      // @ts-ignore - acessando método privado para validar lógica isolada
      const shield = game.generateRandomShield();
      
      expect(shield.isShield).toBe(true);
      expect(shield.points).toBe(10);
    });
  });
});