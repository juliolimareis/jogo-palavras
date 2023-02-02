import { PlayerData, ServerData } from '~~/types';
import { WebSocket } from 'ws';
import { ServerDataPlayerInRoom } from '~~/types';

export function addPlayerInRoom({ idRoom, idUser, name = "", }: PlayerData, ws: WebSocket){
  const room = getRoom(idRoom);

  if(room){
    const playerInRoom = room.players.find(p => p.id === idUser);

    if(!playerInRoom){
      room.players.push({
        id: idUser,
        cards: [],
        specialCards: [],
        ws,
        isReady: false,
        name
      });

      return true
    }else{
      room.players = room.players.filter(p => p.id !== idUser);
      playerInRoom.ws = ws;
      room.players.push(playerInRoom);
    }
  }

  return false;
}

export function getServerDataPlayerInRoom(idRoom: string): ServerDataPlayerInRoom[] {
  const room = getRoom(idRoom);

  if(room){
    return room.players.map(p => ({
      isReady: p.isReady,
      image: p.image,
      name: p.name,
      id: p.id,
    })) ?? [];
  }

  return [];

}

export function getRoom(idRoom: string){
  return globalThis.rooms.find(r => r.id === idRoom);
}

export function getRoomPlayer(idPlayer: string){
  return globalThis.rooms.find(r => r.players.some(p => p.id === idPlayer));
}

export function emitAll(idRoom: string, data: ServerData){
  const room = getRoom(idRoom);

  if(room){
    room.players.forEach(player => {
      player.ws.send(
        JSON.stringify(data)
      )
    });
  }
}

export function setName(idRoom: string, idPlayer: string, name: string){
  const room = getRoom(idRoom);

  if(room){
    room.players.forEach(player => {
      if(player.id === idPlayer){
        player.name = name;
      }
    });
  }
}

export function setReady(idRoom: string, idPlayer: string, isReady: boolean){
  const room = getRoom(idRoom);

  if(room){
    room.players.forEach(player => {
      if(player.id === idPlayer){
        player.isReady = isReady;
      }
    });
  }
}

export function removePlayer(idRoom: string, idPlayer: string){
  const room = getRoom(idRoom);

  //só remove o usuário caso o jogo não tenha começado
  if(room && !room.gameReady){
    room.players = room.players.filter(p => p.id !== idPlayer);
  }
}