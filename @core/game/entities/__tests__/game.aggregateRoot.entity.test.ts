 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest';
import { DeckType } from '../deck.entity';
import Player from '../player.entity';
import GameAggregateRoot, { GameStatus, GameAggregateRootError } from '../game.aggregateRoot.entity';
import DictionaryDatabaseDriver from '../../../common/infra/interfaces/dictionary.database.interface';

class DictionaryDatabase extends DictionaryDatabaseDriver {
  checkWorld(word: string): boolean {
    if (!word || !word.trim()) {
      return false;
    }

    return ["test", "have", "create"].includes(word.toLocaleLowerCase());
  }

  static create(): DictionaryDatabase {
    return new DictionaryDatabase()
  }
}

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
      round: 1,
      players: [
        { id: 'p1', name: 'Admin' },
        { id: 'p2', name: 'Player 2' }
      ],
      deck: { cards: [] },
      results: [],
      dictionaryDatabase: DictionaryDatabase.create()
    };
  });

  describe('Fluxo de Inicialização (Status)', () => {
    it('deve iniciar no status PREPARATION por padrão', () => {
      const game = GameAggregateRoot.create(defaultProps);
      expect(game.toJson().status).toBe(GameStatus.PREPARATION);
    });

    it('deve configurar o deck e distribuir cartas ao iniciar o jogo', () => {
      const game = GameAggregateRoot.create(defaultProps);

      game.startGame();

      const state = game.toJson();

      expect(state.status).toBe(GameStatus.GAMING);
      expect(state.tableCards).toHaveLength(4);

      // 7 cartas + 1 escudo
      expect(state.players[0]?.cards).toHaveLength(8);

      const shield = state.players[0]?.cards?.find(c => c.isShield);
      expect(shield).toBeDefined();
      expect(shield?.points).toBe(10);
    });
  });

  describe('Gestão de Jogadores', () => {
    it('deve permitir adicionar jogadores apenas em PREPARATION', () => {
      const game = GameAggregateRoot.create(defaultProps);
      const newPlayer = Player.create({ id: 'p3', name: 'Player 3' });

      game.addPlayer(newPlayer);
      expect(game.toJson().players).toHaveLength(3);

      game.startGame();

      game.addPlayer(Player.create({ id: 'p4', name: 'Late' }));
      expect(game.toJson().players).toHaveLength(3);
    });

    it('deve remover um jogador corretamente', () => {
      const game = GameAggregateRoot.create(defaultProps);
      const p2 = Player.create({ id: 'p2', name: 'Player 2' });

      game.removePlayer(p2);

      expect(game.toJson().players).toHaveLength(1);
    });
  });

  describe('Lógica de Rodadas', () => {
    it('deve avançar a rodada e distribuir 1 carta extra', () => {
      const game = GameAggregateRoot.create(defaultProps);

      game.startGame();
      const before = game.toJson().players[0]?.cards?.length ?? 0;

      game.startNextRound();

      const state = game.toJson();

      expect(state.status).toBe(GameStatus.GAMING);
      expect(state.round).toBe(2);
      expect(state.players[0]?.cards?.length).toBe(before + 1);
    });

    it('deve finalizar o jogo ao atingir o limite de rounds', () => {
      const game = GameAggregateRoot.create({
        ...defaultProps,
        round: 3,
        maxRounds: 3
      });

      game.startNextRound();

      expect(game.toJson().status).toBe(GameStatus.FINISHED);
    });
  });

  describe('Validação DictionaryDatabase', () => {
    it('deve validar palavras usando dictionaryDatabase', () => {
      const game = GameAggregateRoot.create(defaultProps);

      expect(game.checkWord("test")).toBe(true);
      expect(game.checkWord("invalid")).toBe(false);
    });

    it('deve lançar erro se dictionaryDatabase não for classe', () => {
      expect(() =>
        GameAggregateRoot.create({
          ...defaultProps,
          dictionaryDatabase: {} as any
        })
      ).toThrow(GameAggregateRootError);
    });
  });
});
