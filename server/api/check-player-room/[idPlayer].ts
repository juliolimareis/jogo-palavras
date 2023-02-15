import { getRoomPlayer, } from "~~/game/player";

export default defineEventHandler(event => {
  const idPlayer = event.context.params.idPlayer;

  if(idPlayer){
    const room = getRoomPlayer(idPlayer);

    if(room){
      return { isInRoom: true, idRoom: room.id };
    }
  }

  return { isInRoom: false };
});