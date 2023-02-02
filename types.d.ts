import { WebSocket } from 'ws';

// dados que o cliente envia
interface PlayerData<T = any> {
  idUser?: string;
  idRoom?: string;
  data: T;
  name?: string;
  channel: "enter-room" | "set-name" | "chat-message" | "set-ready";
}

interface DataChat {
  message: string;
}

interface ServerDataPlayerInRoom {
  id: string;
  name?: string;
  isReady: boolean;
  image?: string;
}

interface ServerDataSerName {
  name: string;
}

//dados que o servidor envia
interface ServerData<T = any> {
  channel: "players-in-room" | "chat-message" | "game-start" | "remove-player";
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

interface Room extends RoomData{
  round: number;
  timeout: number; //tempo atual do contador da rodada
  results: Result[];
  players: PlayerRoom[];
  deck: Card[];
  gameReady?: boolean;
}

interface PlayerRoom {
  id: string;
  ws: WebSocket,
  image?: string;
  name?: string;
  specialCards: Card[];
  cards: Card[];
  isReady: boolean;
}

interface Result {
  roundNumber: number;
  idPlayer: string;
  cards: Cards[];
  points: number; 
}

interface Card {
  value: string;
  points: number;
  image?: string;
  addition?: string;
  isSpecial?: boolean;
}