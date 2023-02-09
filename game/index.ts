import { emitAll, getRoom } from "~~/core/dataUser";
import { getDeckProfile, getHand, getTableCards } from "./deck";

export function startGame(idRoom: string) {
  const room = getRoom(idRoom);

  if(room){
    room.gameReady = true;
    room.deck = getDeckProfile(room.maxPlayers);

    // distribui as cartas dos jogadores
    room.players.forEach(p => {
      const { deck, hand } = getHand(room.deck);

      room.deck = deck;
      p.handCards = hand;
    });

    // add as catas na mesa
    const { deck, table } = getTableCards(room.deck);

    room.deck = deck;
    room.tableCards = table;

    emitAll(room.id, {
      channel: "game-start",
      data: {
        path: room.id
      }
    });
    
    startTimeRound(room);
  }

}

function startTimeRound(room: Room){
  let timeout = room.roundTimeout * 60;
  
  const interval = setInterval(() => {

    timeout--;

    emitAll(room.id, {
      channel: "round-timeout",
      data: { timeout }
    });

    if(timeout === 0){
      clearInterval(interval);
    }
  }, 1000);
}