import WebSocket, { WebSocketServer } from "ws"

type Client = {
  id: string
  send: (message: string) => void
  readyState: number
}

declare global {
  var wss: WebSocketServer
  var clients: Client[]
}

let wss: WebSocketServer
let clients: Client[] = []

export default defineEventHandler((event) => {

  console.log("server", event.node.res.socket?.server);
  
  if (!global.wss) {
    // wss = new WebSocketServer({ server: event.node.res.socket?.server })
    wss = new WebSocketServer({ port: 1547 });
    console.log("Server started!");

    wss.on("connection", (socket) => {
      console.log("connection!");
  
      socket.send("connected");

      socket.on("message", (message) => {

        console.log("client send: %s", message);
        
        wss.clients.forEach((client) => {
          if (client === socket && client.readyState === WebSocket.OPEN) {
            clients.push({
              id: message.toString(),
              send: (data: string) => client.send(data),
              readyState: client.readyState,
            })
            global.clients = clients
          }
        })
      })

      socket.on("close", (code, reason) => {
        console.log("reason: %s:", reason);
        console.log("code: %s:", code);
      });

    })
    
    global.wss = wss
  }
})