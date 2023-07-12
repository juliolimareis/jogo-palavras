import { getRoom, } from "~~/composables/game/player";

export default defineEventHandler<CheckRoomResponse>(event => {
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
        maxRounds: room.maxRounds,
        roomIsFull: room.players.length >= room.maxPlayers,
        maxPlayers: room.maxPlayers,
        roundTimeout: room.roundTimeout
      };
    }
  }

  event.node.res.statusCode = 404;

  return { message: "room not found.", roomExists: false, roomIsFull: false };
});