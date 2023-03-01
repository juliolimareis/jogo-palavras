import WebSocket, { WebSocketServer, } from "ws"
import { handleAttack, handleConfirmRound, restartGame, giveUpPlayer, startGame } from "~~/game"
import { addPlayerInRoom, addWordPlayerInResults, emit, emitAll, getHandCardsPlayer, getHandCardsPlayers, getResultsRoom, getRoom, getRoomPlayer, getServerDataPlayerInGame, getServerDataPlayerInRoom, isAdmin, removePlayer, setName, setReady, } from "~~/game/player"
declare global {
  var wss: WebSocketServer
  var rooms: Room[]
}

let wss: WebSocketServer;
const TIME_ROOM_COLETOR = 30; // minutes

global.rooms = [
  {
    id: "b675b85c-407e-493f-a8da-9c9c222164d8",
    deck: [],
    tableCards: [],
    difficulty: "0",
    idAdmin: "17e186c9-a0e4-401f-961f-c54e706dc5c0",
    maxRounds: 10,
    maxPlayers: 10,
    results: [],
    players: [],
    round: 0,
    roundTimeout: 1,
  }
];

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
    console.log("room has been removed: ", rooms[id].id)
    rooms.splice(id, 1); 
  });

  console.log("number of room after coletor", rooms.length);
}, TIME_ROOM_COLETOR * 60 * 1000);

export default defineEventHandler(() => {  
  if (!global.wss) {
    // wss = new WebSocketServer({ server: event.node.res.socket?.server })
    wss = new WebSocketServer({ port: 3007 });

    wss.on("connection", (socket: WebSocket) => {
      let idRoom = "";
      let idUser = "";
      let userName = "";

      console.log("connected !");

      socket.on("message", async (message) => {
        const playerData: PlayerData = JSON.parse(message.toString());

        switch (playerData.channel) {
          case "give-up":
            giveUpPlayer(idRoom, idUser);
            break;
          case "confirm-round":
            await handleConfirmRound(idRoom, idUser, playerData?.data?.confirm);
            break;
          case "attack":
            if(idRoom && idUser && userName && playerData.data?.result && playerData.data?.cardsIds){
              if(handleAttack(idUser, playerData.data.result, playerData.data.cardsIds)){
                emitAll(
                  idRoom, {
                    channel: "attack",
                    data: {
                      results: getResultsRoom(idRoom),
                    }
                  }
                );

                emit(
                  idRoom, idUser, {
                    channel: "refresh-hand",
                    data: {
                      handCards: await getHandCardsPlayer(idRoom, idUser)
                    }
                  }
                );
              }
            }
            break;
          case "finish-round":
            console.log("[finished-round]");

            addWordPlayerInResults(idRoom, idUser, playerData.data.cards as GameCard[]);

            if(getRoom(idRoom)?.endGame){
              console.log("[finished-round] end-game");
              
              emitAll( //retorna os dados com os pontos torais de cada jogador
                idRoom, {
                  channel: "end-game",
                  data: getHandCardsPlayers(idRoom)
                } as ServerData<HandCardsPerPlayer[]>
              );
            }

            console.log("result-round");

            emitAll( // retorna results da room, para o front calcular como esta o rank no momento
              idRoom, {
                channel: "result-round",
                data: getResultsRoom(idRoom)
              } as ServerData<Result[]>
            );
            
          break;
          case "game-start":
            if(isAdmin(idUser, idRoom)){
              startGame(idRoom);
            }
            break;
          case "enter-room":
            idUser = playerData.idUser ?? "";
            idRoom = playerData.idRoom ?? "";
            userName = playerData.name ?? "";

            if(addPlayerInRoom(playerData, socket)){
              emitAll(
                idRoom, {
                  channel: "players-in-room",
                  data: getServerDataPlayerInRoom(idRoom)
                } as ServerData<ServerDataPlayerInRoom[]>
              );
            }
            break; 
          case "enter-game":
            console.warn("[enter-game] Try enter game.");

            let isReconnect = false;

            if(!idUser && !idRoom && !userName){
              console.warn("[enter-game] fist entry");

              idUser = playerData.idUser ?? "";
              idRoom = playerData.idRoom ?? "";
              userName = playerData.name ?? ""; 

              isReconnect = true;
            }else{
              console.warn("[enter-game] game continue");
            }

            if(getRoomPlayer(idUser)){
              let ws;

              if(isReconnect){
                ws = socket;
              }

              const data = getServerDataPlayerInGame(idRoom, idUser, ws);

              if(data){
                console.warn("[enter-game] emit: player-in-game");

                emit(
                  idRoom,
                  idUser,
                  {
                    channel: "player-in-game",
                    data: data
                  } as ServerData<ServerDataPlayerInGame>
                );
              }else{
                console.warn("[enter-game] room not found or gameReady failed");
              }
            }else{
              console.warn("[enter-game] Player not found in room");
            }

            break; 
          case "set-name":
            userName = playerData.data.name;

            setName(idRoom, idUser, userName);
            emitAll(
              idRoom, {
                channel: "players-in-room",
                data: getServerDataPlayerInRoom(idRoom)
              } as ServerData<ServerDataPlayerInRoom[]>
            );
            break;
          case "set-ready":
            setReady(idRoom, idUser, !!(playerData.data?.isReady));
            emitAll(
              idRoom, {
                channel: "players-in-room",
                data: getServerDataPlayerInRoom(idRoom)
              } as ServerData<ServerDataPlayerInRoom[]>
            );
            break;
          case "game-restart":
            restartGame(idRoom, idUser);
            
            console.warn("[game-restart] emitAll: game-restart");

            emitAll(
              idRoom,
              {
                channel: "game-restart",
                data: {}
              } as ServerData
            );
            break;
          case "chat-message":            
            if(
              userName.trim()
                && typeof playerData.data.message === "string"
                  && playerData.data.message.trim() 
            ){
              emitAll(
                idRoom, {
                  channel: "chat-message",
                  data: {
                    message: `${userName}: ${playerData.data.message}`
                  }
                } as ServerData<DataChat>
              );
            }
            break;
          default:
            break;
        }
      })

      socket.on("close", (code, reason) => {
        console.log("reason: %s:", reason);
        console.log("code: %s:", code);
        
        removePlayer(idRoom, idUser);

        emitAll(
          idRoom, {
            channel: "players-in-room",
            data: getServerDataPlayerInRoom(idRoom)
          } as ServerData<ServerDataPlayerInRoom[]>
        );
      });

    });
    
    global.wss = wss
  }
});