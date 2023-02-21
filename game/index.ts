import { connectRoom, emitAll, extractPlayerRoom, getRoom, getRoomPlayer } from "~~/game/player";
import { getDeckProfile, getHand, getNextCard, getTableCards } from "./deck";

const TIMEOUT_TO_NEXT_ROUND = 12; // seconds to next round

export function handleAttack(idPlayer: string, result: Result, cardsIds: number[]){
  const room = getRoomPlayer(idPlayer);

  if(room){
    const resultIndex = room.results.findIndex(
      r => r.round === result.round && r.idPlayer === result.idPlayer
    );

    if(resultIndex !== -1){
      result.hasAttacked = true;

      result.cards.forEach(c => {
        if(cardsIds.includes(Number(c.id))){
          c.value = "@";
          c.points = 0;
        }
      });

      room.results[resultIndex] = result;

      const player = extractPlayerRoom(room, idPlayer);

      if(player){
        let countCards = cardsIds.length;

        player.handCards = player.handCards.filter(c => {
          if(countCards > 0 && c.value === "ATK"){
            countCards--;

            return false;
          }

          return true;
        });
      }

      console.log("handCardsPlayer: ", player?.handCards);

      return true;
    }
  }

  return false;
}

export function restartGame(idRoom: string, idPlayer: string){
  connectRoom(idRoom, idPlayer).then(({ room }) => {
    if(!room.gameReady && room.idAdmin === idPlayer){
      room.deck = [],
      room.results = [],
      room.round = 0,
      room.tableCards = []
    }

    startGame(idRoom);
  });
}

export function startGame(idRoom: string){
  const room = getRoom(idRoom);

  if(room){
    room.gameReady = true;
    room.endGame = false;
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

    console.log("[startGame][game-start] - Start game");

    emitAll(room.id, { // emite para room que o jogo começou
      channel: "game-start",
      data: {
        path: room.id
      }
    });
    
    startTimeRound(room);
  }

}

export function sumWordPoints(cards: GameCard[]){
  const bonus = cards.length ? 10 : 0;
  
  return cards.reduce((t, c) => c.points + t, 0) + bonus;
}

function startTimeRound(room: Room){
  console.log("[startTimeRound] - init");

  let timeout = room.roundTimeout * 60;
  
  const interval = setInterval(() => {

    timeout--;

    emitAll(room.id, {
      channel: "round-timeout",
      data: { timeout }
    });

    if(timeout === 0){
      clearInterval(interval);

      if((room.round + 1) < room.maxRounds){
        console.log("[startTimeRound] - timeNextRound");
        timeNextRound(room);
      }else{
        room.endGame = true;
        room.gameReady = false;
        console.log("[startTimeRound]: Game Over.");
      }
    }
  }, 1000);
}

function timeNextRound(room: Room){  
  console.log("[timeNextRound] - Init");

  setTimeout(() => {
    startNextRound(room);
  }, TIMEOUT_TO_NEXT_ROUND * 1000);
}

function startNextRound(room: Room){
  console.log("[startNextRound] - Init");

  // add uma carta para cada jogador
  room.players.forEach(p => {
    const { card, deck } = getNextCard(room.deck);

    room.deck = deck;
    p.handCards.push(card);
  });

  // add as catas na mesa
  const { deck, table } = getTableCards(room.deck);

  room.round++;
  room.deck = deck;
  room.tableCards = table;

  console.log("[startNextRound][next-round] - Iniciando novo round");
  console.log("round: " + room.round);

  emitAll(room.id, {
    channel: "next-round",
    data: {}
  });
  
  startTimeRound(room);
}