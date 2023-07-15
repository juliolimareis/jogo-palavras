import { v4 as uuid, } from "uuid";
import { getRoomPlayer, } from "../utils/players";
import { checkBody, } from "../utils/validation";

export default defineEventHandler(async (event) => {
  return checkBody(await readBody<RoomData>(event)).then(body => {
    const roomPlayer = getRoomPlayer(body.idAdmin);

    if(roomPlayer){
      event.node.res.statusCode = 409;

      return { body: { idRoom: roomPlayer.id, message: "player in room." } };
    }

    const id = uuid();

    globalThis.rooms.push({
      ...body,
      id,
      round: 0,
      deck: [],
      results: [],
      players: [],
      tableCards: [],
      idAdmin: body.idAdmin
    });

    event.node.res.statusCode = 201;

    return { body: { idRoom: id, message: "room created." } };
  }).catch(errors => {
    event.node.res.statusCode = 400;

    return { body: { message: errors } };
  });
});

