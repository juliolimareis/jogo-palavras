import { connectRoom, emitAll, extractPlayerRoom, getRoom, getRoomPlayer, } from "./players";
import { getCardShield, getDeckProfile, getHand, getJpDeckProfile, getNextCard, getTableCards, } from "./deck";

const TIMEOUT_TO_NEXT_ROUND = 12; // seconds to next round

export async function giveUpPlayer(idRoom: string, idPlayer: string){
  connectRoom(idRoom, idPlayer)
    .then(({ room, player }) => {
      player.ws.close();

      const indexPlayer = room.players.indexOf(player);

      if(indexPlayer !== -1){
        room.players.splice(indexPlayer, 1);
      }
    });
}

export async function handleConfirmRound(idRoom: string, idPlayer: string, confirm: boolean){
  return connectRoom(idRoom, idPlayer)
    .then(({ room, player }) => {
      player.confirmRound = confirm;

      if(!room.players.some(p => !p.confirmRound)){
        room.jumpRound = true;

        return true;
      }

      return false;
    }).catch(err => {
      console.log(err);

      return false;
    });
}

export function handleAttack(idPlayer: string, result: Result, cardsIds: number[]){
  const room = getRoomPlayer(idPlayer);

  if(room){
    const attackingPlayer = extractPlayerRoom(room, idPlayer);
    const playerVictim = extractPlayerRoom(room, result.idPlayer);

    if(attackingPlayer && playerVictim){
      const resultIndex = room.results.findIndex(
        r => r.round === result.round && r.idPlayer === result.idPlayer
      );

      if(resultIndex !== -1){
        const amountShieldsInResult = room.results[resultIndex].cards.filter(c => c.isShield);
        const amountAttacksInHand = attackingPlayer.handCards.filter(c => c.value === "ATK").length;

        if(amountAttacksInHand > amountShieldsInResult.length){
          if(amountShieldsInResult.length){
            amountShieldsInResult.forEach(c => {
              playerVictim?.handCards.push({ ...c });
            });

            playerVictim?.ws.send(JSON.stringify({
              channel: "refresh-hand",
              data: { handCards: playerVictim.handCards }
            }));
          }

          result.hasAttacked = true;

          result.cards.forEach(c => {
            if(cardsIds.includes(Number(c.id))){
              c.value = "@";
              c.points = 0;
              c.isShield = false;
            }
          });

          room.results[resultIndex] = result;

          //quantidade de cartas de ataques que vão se retiradas.
          let countCards = amountShieldsInResult.length + 1;

          attackingPlayer.handCards = attackingPlayer.handCards.filter(c => {
            if(countCards > 0 && c.value === "ATK"){
              countCards--;

              return false;
            }

            return true;
          });

          console.log("handCardsPlayer: ", attackingPlayer?.handCards);

          return true;
        }
      }
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
      room.tableCards = [];
    }

    room.players.forEach(p => p.confirmRound = false);

    startGame(idRoom);
  });
}

export function startGame(idRoom: string){
  const room = getRoom(idRoom);

  if(room){
    room.gameReady = true;
    room.endGame = false;
    room.jumpRound = false;

    if(room.type === "jp"){
      room.deck = getJpDeckProfile(room.maxPlayers);
    }else{
      room.deck = getDeckProfile(room.maxPlayers);
    }

    // distribui as cartas dos jogadores
    room.players.forEach(p => {
      const { deck, hand } = getHand(room.deck);
      const cardShield = getCardShield(deck.length, room.type);

      hand.push(cardShield);
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
      data: { path: room.id, type: room.type }
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
    if(room.jumpRound){
      timeout = 0;
    }else{
      timeout--;
    }

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

  room.jumpRound = false;

  // add uma carta para cada jogador
  room.players.forEach(p => {
    const { card, deck } = getNextCard(room.deck);

    //check player don't have card shield in hand
    if(!p.handCards.some(c => c.isShield)){
      const cardShield = getCardShield(deck.length, room.type);

      p.handCards.push(cardShield);
    }

    p.confirmRound = false;

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