import { getRoom, } from "~~/game/player";

export default defineEventHandler<CheckRoomResponse | { message: "room not found.", roomExists: false }>(async event => {
  const idRoom = event.context.params.idRoom;

  if(idRoom){
    const room = getRoom(idRoom);

    if(room){
      return {
        idRoom: room.id,
        roomExists: true,
        message: "room exist.",
        idAdmin: room.idAdmin,
        gameReady: !!(room.gameReady),
        roomIsFull: room.players.length >= room.maxPlayers
      };
    }
  }

  event.node.res.statusCode = 404;

  return { message: "room not found.", roomExists: false };
});