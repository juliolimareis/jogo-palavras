import { WebSocketServer, } from "ws";

export default async (inlineOptions, nuxt) => {
  const port = 1574;

  const wss = new WebSocketServer({ port });

  console.log(`Server World is running on ws://127.0.0.1:${port}`);

  wss.on("connection", (ws) => {
    console.warn("Player try connected");

    ws.send("Hello World!");

    ws.on("message", (data) => {
      console.log("received %s", data);
    });

    ws.on("close", () => {
      console.log("Player disconnected");
    });
  });

  // nuxt.hook("ready", async nuxt => { console.log("Nuxt is ready"); });
};

