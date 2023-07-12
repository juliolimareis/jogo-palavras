import { WebSocket, } from "ws";

declare global {
  // dados que o cliente envia
  interface PlayerData<T = any> {
    idUser?: string;
    idRoom?: string;
    data: T;
    name?: string;
    channel: "give-up" | "confirm-round" | "attack" | "game-restart" | "finish-round" | "round-timeout" | "enter-room" | "set-name" | "chat-message" | "set-ready" | "game-start" | "enter-game";
  }

  interface DataChat {
    message: string;
  }

  interface ServerDataPlayerInRoom {
    id: string;
    name?: string;
    isReady: boolean;
    image?: string;
    isOnline?: boolean;
    totalScore?: number;
  }

  interface ServerDataPlayerInGame {
    handCards: GameCard[];
    tableCards: GameCard[];
    results: Result[];
    profilePlayersRoom: ServerDataPlayerInRoom[]
  }

  interface ServerDataSerName {
    name: string;
  }

  //dados que o servidor envia
  interface ServerData<T = any> {
    channel: "refresh-hand" | "attack" | "game-restart" | "result-round" | "next-round" | "end-game" | "round-timeout" | "players-in-room" | "chat-message" | "game-start" | "remove-player" | "game-start" | "player-in-game";
    data: T;
  }

  interface RoomData {
    id: string;
    idAdmin: string;
    maxPlayers: number;
    maxRounds: number;
    roundTimeout: number;
    type: "pt" | "en" | "jp"
  }

  interface Room extends RoomData {
    round: number;
    results: Result[];
    players: PlayerRoom[];
    deck: GameCard[];
    tableCards: GameCard[];
    gameReady?: boolean;
    endGame?: boolean;
    jumpRound?: boolean;
    prepareToRemoval?: boolean;
    type: "pt" | "en" | "jp"
  }

  interface PlayerRoom {
    id: string;
    ws: WebSocket,
    image?: string;
    name?: string;
    cardsShields: GameCard[];
    handCards: GameCard[];
    isReady: boolean;
    totalScore?: number;
    /*
    Apenas para saber se o jogador está online na tela do jogo.
    Isso não se aplica na tela da sala, pois neste caso o jogador é removido da sala quando fica offline.
    */
    isOnline?: boolean;
    confirmRound?: boolean;
  }

  interface Result {
    round: number;
    idPlayer: string;
    cards: GameCard[];
    score: number;
    playerName: string;
    hasAttacked?: boolean;
  }

  /**
   * @acc: Acentuação
   */
  interface GameCard {
    id?: number;
    value: string;
    points: number;
    image?: string;
    isShield?: boolean;
    isSelected?: boolean;
    jokerValue?: string;
    isJoker?: boolean;
    acc?: string;
    sp?: string[];
    finalValue?: string;
  }

  interface CheckRoomResponse {
    message: "room exist." | "room not found.";
    idRoom?: string;
    idAdmin?: string;
    gameReady?: boolean;
    roomExists: boolean;
    roomIsFull: boolean;
    maxRounds?: number;
    maxPlayers?: number;
    roundTimeout?: number;
  }

  interface CreateRoomResponse {
    body: { idRoom: string, message: string }
  }

  type MessageStatus = "disconnected" |"process-round" | "round-score" | "start" | "loading" | "offline" | "timeout" | "not-found" | "not-ready";
  interface TotalScorePlayer {
    playerName: string;
    totalScore: number;
    idPlayer: string;
    scoreHand: number;
  }

  interface HandCardsPerPlayer {
    idPlayer: string;
    handCards: GameCard[];
  }
}