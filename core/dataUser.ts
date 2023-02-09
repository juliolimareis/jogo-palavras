import { WebSocket } from 'ws';

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
      id: p.id,
      name: p.name,
      image: p.image,
      isReady: p.isReady,
      isOnline: p.isOnline
    })) ?? [];
  }

  return [];

}

export function getServerDataPlayerInGame(idRoom: string, idPlayer: string, ws: WebSocket): ServerDataPlayerInGame | undefined {
  const room = getRoom(idRoom);

  if(room && room.gameReady){
    const player = extractPlayerRoom(room, idPlayer);
    
    if(player){
      const handCards = player?.handCards ?? [];
      const tableCards = room.tableCards;
      const profilePlayersRoom = getServerDataPlayerInRoom(idRoom);

      player.ws = ws;
      
      return {
        handCards,
        tableCards,
        profilePlayersRoom,
      };
    }
  }

  return undefined;
}

export function isAdmin(idUser: string, idRoom: string): boolean {
  return getRoom(idRoom)?.idAdmin === idUser;
}

export function getRoom(idRoom: string){
  return globalThis.rooms.find(r => r.id === idRoom);
}

export function extractPlayerRoom(room: Room, idPlayer: string){
  return room.players.find(p => p.id === idPlayer);
}

export function roomExists(idRoom: string){
  return !!(getRoom(idRoom));
}

export function getRoomPlayer(idPlayer: string){
  return globalThis.rooms.find(r => r.players.some(p => p.id === idPlayer));
}

export function emitAll(idRoom: string, data: ServerData){
  const room = getRoom(idRoom);

  if(room){
    room.players.forEach(p => {
      p.ws.send(
        JSON.stringify(data)
      );
    });
  }
}

export function emit(idRoom: string, idPlayer: string, data: ServerData){
  const room = getRoom(idRoom);

  if(room){
    room.players.some(p => {
      if(p.id === idPlayer){
        p.ws.send(
          JSON.stringify(data)
        );

        return true;
      }
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