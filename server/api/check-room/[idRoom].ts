import { getRoom, } from "~~/core/dataUser";
import { CheckRoomResponse, } from "~~/types";

export default defineEventHandler<CheckRoomResponse>(async event => {
  const idRoom = event.context.params.idRoom;

  if(idRoom){
    const room = getRoom(idRoom);

    if(room){
      return {
        idRoom: room.id,
        roomExists: true,
        message: "room exist.",
        idAdmin: room.idAdmin,
        gameReady: !!(room.gameReady)
      };
    }
  }

  event.node.res.statusCode = 404;

  return { message: "room not found.", roomExists: false };
});