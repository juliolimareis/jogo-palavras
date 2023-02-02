import WebSocket, { WebSocketServer, Server } from "ws"
import { addPlayerInRoom, emitAll, getServerDataPlayerInRoom, removePlayer, setName, setReady, } from "~~/core/dataUser"
import { DataChat, PlayerData, Room, ServerData, ServerDataPlayerInRoom } from "~~/types"
declare global {
  var wss: WebSocketServer
  var rooms: Room[]
}

let wss: WebSocketServer

global.rooms = [
  {
    id: "b675b85c-407e-493f-a8da-9c9c222164d8",
    deck: [],
    difficulty: "0",
    idAdmin: "17e186c9-a0e4-401f-961f-c54e706dc5c0",
    maxRounds: 3,
    maxPlayers: 10,
    results: [],
    players: [],
    round: 0,
    roundTimeout: 3,
    timeout: 0,
  }
];

console.log("Init Socket");

export default defineEventHandler((event) => {  
  if (!global.wss) {
    // wss = new WebSocketServer({ server: event.node.res.socket?.server })
    wss = new WebSocketServer({ port: 3007 });

    wss.on("connection", (socket: WebSocket) => {
      let idRoom = "";
      let idUser = "";
      let userName = "";

      socket.on("message", (message) => {
        const playerData: PlayerData = JSON.parse(message.toString());

        switch (playerData.channel) {
          case "enter-room":
            idUser = playerData.idUser ?? "";
            idRoom = playerData.idRoom ?? "";
            userName = playerData.name ?? "";

            if(addPlayerInRoom(playerData, socket))
              emitAll(
                idRoom,
                {
                  channel: "players-in-room",
                  data: getServerDataPlayerInRoom(idRoom)
                } as ServerData<ServerDataPlayerInRoom[]>
              );
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
          case "chat-message":            
            if(userName.trim()
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
})