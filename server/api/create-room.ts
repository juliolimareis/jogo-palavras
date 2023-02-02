import { RoomData, } from "~~/types";
import { v4 as uuid, } from "uuid";
import { getRoomPlayer, } from "~~/core/dataUser";

export default defineEventHandler(async (event) => {
  const body = await readBody<RoomData>(event);
  const roomPlayer = getRoomPlayer(body.idAdmin);

  if(roomPlayer){
    event.node.res.statusCode = 209;

    return { body: { idRoom: roomPlayer.id, message: "player in room." } };
  }

  if(Object.values(body).filter(v => v).length === 5) {
    const id = uuid();

    globalThis.rooms.push({
      ...body,
      deck: [],
      results: [],
      round: 1,
      players: [],
      timeout: 1,
      id,
      idAdmin: body.id
    });

    event.node.res.statusCode = 201;

    return { body: { idRoom: id, message: "room created." } };
  }

  event.node.res.statusCode = 400;

  return { body: { message: "values in body incomplete." } };
});

