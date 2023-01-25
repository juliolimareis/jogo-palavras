import { ClientData, } from "~~/types";

export default defineEventHandler(async (event) => {
  const clientData = await readBody<ClientData>(event);

  if(globalThis?.clients){
    switch (clientData.channel) {
    case "global-chat":
      globalThis.clients.forEach(
        (client) => client.ws.send(`${clientData.name}: ${clientData.data.message}`)
      );
      break;
    default:
      break;
    }
  }

  return {
    statusCode: 200,
    body: "This is done",
  };
});