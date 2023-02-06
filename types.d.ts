import { WebSocket } from 'ws';

// dados que o cliente envia
interface PlayerData<T = any> {
  idUser?: string;
  idRoom?: string;
  data: T;
  name?: string;
  channel: "round-timeout" | "enter-room" | "set-name" | "chat-message" | "set-ready" | "game-start" | "enter-game";
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
}

interface ServerDataPlayerInGame {
  handCards: Card[];
  tableCards: Card[];
  profilePlayersRoom: ServerDataPlayerInRoom[]
}


interface ServerDataSerName {
  name: string;
}

//dados que o servidor envia
interface ServerData<T = any> {
  channel: "round-timeout" | "players-in-room" | "chat-message" | "game-start" | "remove-player" | "game-start" | "player-in-game";
  data: T;
}

interface RoomData {
  id: string;  
  idAdmin: string;
  maxPlayers: number;
  maxRounds: number;
  roundTimeout: number;
  difficulty: "0" | "1" | "2";
}

interface Room extends RoomData {
  round: number;
  timeout: number; //tempo atual do contador da rodada
  results: Result[];
  players: PlayerRoom[];
  deck: Card[];
  tableCards: Card[];
  gameReady?: boolean;
}

interface PlayerRoom {
  id: string;
  ws: WebSocket,
  image?: string;
  name?: string;
  cardsShields: Card[];
  handCards: Card[];
  isReady: boolean;
  /*
   Apenas para saber se o jogador está online na tela do jogo. 
   Isso não se aplica na tela da sala, pois neste caso o jogador é removido da sala quando fica offline. 
  */
  isOnline?: boolean; 
}

interface Result {
  roundNumber: number;
  idPlayer: string;
  cards: Cards[];
  points: number; 
}

/**
 * @acc: Acentuação
 */
interface Card {
  value: string;
  points: number;
  image?: string;
  acc?: string;
  isShield?: boolean;
}

interface CheckRoomResponse {
  message: "room exist." | "room not found.";
  idRoom?: string;
  idAdmin?: string;
  gameReady?: boolean;
  roomExists: boolean;
}