import WebSocket, { WebSocketServer } from "ws"
import { Client, ClientData } from "~~/types"
declare global {
  var wss: WebSocketServer
  var clients: Client[]
}

let wss: WebSocketServer
let clients: Client[] = []

export default defineEventHandler((event) => {
  
  if (!global.wss) {
    // wss = new WebSocketServer({ server: event.node.res.socket?.server })
    wss = new WebSocketServer({ port: 1547 });

    wss.on("connection", (socket) => {
      if(!global?.clients)
        global.clients = [];

      socket.on("message", (message) => {
        const data: ClientData = JSON.parse(message.toString());

        if(socket.readyState === WebSocket.OPEN){
          global.clients.push({
            id: data.id,
            ws: socket,
            name: data.name
          })
        }
        
        // wss.clients.forEach((client) => {
        //   if (client == socket && client.readyState === WebSocket.OPEN) {
        //     clients.push({
        //       id: data.id,
        //       send: (data: string) => client.send(data),
        //       readyState: client.readyState,
        //     })
        //     global.clients = clients
        //   }
        // })
      })

      socket.on("close", (code, reason) => {
        console.log("reason: %s:", reason);
        console.log("code: %s:", code);
      });

    });
    
    global.wss = wss
  }
})