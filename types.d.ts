import { WebSocket } from 'ws';
// dados do cliente
interface Client {
  id: string;
  ws: WebSocket;
  name: string;
  // readyState: number;
}

// dados que o cliente envia
interface ClientData {
  id: string;
  data: DataChat;
  channel: "global-chat";
  name: string;
}

interface DataChat{
  message: string;
}

//dados que o servidor envia
interface ServerData {
  data: DataChat;
}