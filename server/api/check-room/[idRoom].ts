import { getRoom, } from "~~/core/dataUser";

export default defineEventHandler(async event => {
  const idRoom = event.context.params.idRoom;

  if(idRoom){
    const room = getRoom(idRoom);

    if(room){
      return { message: "room exist.", idAdmin: room.idAdmin };
    }
  }

  event.node.res.statusCode = 404;

  return { message: "room not found." };
});