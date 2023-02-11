import { specialLatters } from './../game/cards';
import { WebSocket } from 'ws';
import { sumWordPoints } from '~~/game';

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
      isOnline: p.isOnline,
      totalScore: p?.totalScore ?? 0,
    })) ?? [];
  }

  return [];
}

export function gerResultsRoom(idRoom: string) {
  const room = getRoom(idRoom);

  if(room){
    return room.results;
  }

  return [];
}

export function identTotalScore(results: Result[]) {
  const roundsSet = new Set<number>(results.map(r => r.round));
  const resultPerRound: Record<string, Result[]> = {};

  roundsSet.forEach((r, i) => {
    resultPerRound[i] = results.filter(rd => rd.round === r);
  });

  return resultPerRound;
}

export function addWordPlayerInResults(idRoom: string, idPlayer: string, cards: GameCard[]) {
  console.log("[addWordPlayerInResults] init");
  
  const room = getRoom(idRoom);

  if(room){
    const player = extractPlayerRoom(room, idPlayer);

    if(player){
      if(player.handCards && cards.length){
        player.handCards = player.handCards.filter(c => !cards.some(cd => c.id === cd.id));
      }
    
      room.results.push({
        cards,
        idPlayer,
        round: room.round,
        points: sumWordPoints(cards),
        playerName: player.name ?? "",
      });

      console.log("[addWordPlayerInResults] ok!");
    }
  }
}

export function sumTotalScorePlayers(idRoom: string){
  const room = getRoom(idRoom);

  return 0;

  // if(room){
  //   room.players.forEach(player => {
  //     let playerResults: Result[] = [];
      
  //     room.results.forEach(result => {
  //       playerResults = [...playerResults, ...result.filter(r => r.idPlayer === player.id)];
  //     });
      
  //     const sumResults = playerResults.reduce((t, pr) => {
  //       let special = 0;

  //       // verifica se tem caracteres special na palavra, sem sim + 10 pontos
  //       if(specialLatters.some(sp => pr.cards.some(c => c.value === sp || c.jokerValue === sp))){
  //         special = 10;
  //       }

  //       return t + pr.points + special;
  //     }, 0);
  //     const sumResultsHand = player.handCards.reduce((t, hc) => t + hc.points, 0);

  //     player.totalScore = sumResults + sumResultsHand;
  //   });
  // }
}

export function getServerDataPlayerInGame(idRoom: string, idPlayer: string, ws?: WebSocket): ServerDataPlayerInGame | undefined {
  const room = getRoom(idRoom);

  if(room && room.gameReady){
    const player = extractPlayerRoom(room, idPlayer);
    
    if(player){
      const handCards = player?.handCards ?? [];
      const tableCards = room.tableCards;
      const profilePlayersRoom = getServerDataPlayerInRoom(idRoom);

      if(ws){
        player.ws = ws;
      }
      
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
    try {
      room.players.forEach((p) => {
        p.ws.send(
          JSON.stringify(data)
        );
      });
    } catch (error) {
      console.log("[emitAll] Error!");
      console.log("[emitAll- data]: ", data);
      console.log(error);
    }
  }
}

export function emit(idRoom: string, idPlayer: string, data: ServerData){
  const room = getRoom(idRoom);

  if(room){
    const player = extractPlayerRoom(room, idPlayer);

    if(player){
      player.ws.send(
        JSON.stringify(data)
      );
    }
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