// import WebSocket, { WebSocketServer, } from "ws";
// import { handleAttack, handleConfirmRound, restartGame, giveUpPlayer, startGame, } from "../utils";
// import { addPlayerInRoom, addWordPlayerInResults, emit, emitAll, getHandCardsPlayer, getHandCardsPlayers, getResultsRoom, getRoom, getRoomPlayer, getServerDataPlayerInGame, getServerDataPlayerInRoom, isAdmin, removePlayer, setName, setReady, } from "../utils/players";
declare global {
  var rooms: Room[];
}

const TIME_ROOM_COLETOR = 30; // minutes

setInterval(() => {
  const rooms = global.rooms;
  const idsToRemove = [] as number[];

  console.log("idsToRemove: ", idsToRemove);

  rooms.forEach((room, i) => {
    if(room.prepareToRemoval){
      idsToRemove.push(i);
    }else{
      if(!room.players.length){
        room.prepareToRemoval = true;
      }
    }
  });

  idsToRemove.forEach(id => {
    console.log("room has been removed: ", rooms[id].id);
    rooms.splice(id, 1);
  });

  console.log("number of room after coletor", rooms.length);
}, TIME_ROOM_COLETOR * 60 * 1000);

export default defineEventHandler(() => {
  if(!global.rooms){
    global.rooms = [
      {
        id: "b675b85c-407e-493f-a8da-9c9c222164d8",
        deck: [],
        tableCards: [],
        idAdmin: "17e186c9-a0e4-401f-961f-c54e706dc5c0",
        maxRounds: 5,
        maxPlayers: 10,
        results: [],
        players: [],
        round: 0,
        roundTimeout: 3,
        type: "jp"
      }
    ];
  }
});
