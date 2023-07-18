import { Server, Socket, } from "socket.io";

interface SocketGame extends Server {
  rooms: Room[]
}

export default function socketIO(io: SocketGame) {
  const TIMEOUT_TO_NEXT_ROUND = 12; // seconds to next round
  // io.on("connection", (socket: Socket) => {
  //   console.log("socket connected", socket.id);

  //   socket.on("join room", (room) => {
  //     socket.join(room);
  //   });

  //   socket.on("disconnect", (reason) => {
  //     console.log("socket disconnected");
  //     io.emit("user disconnected", socket.id);
  //   });

  //   socket.on("event", (room) => {
  //     console.log(room);

  //     socket.emit("game", { message: "Hi" });
  //   });
  // });

  if(!io.rooms){
    io.rooms = [
      {
        id: "b675b85c-407e-493f-a8da-9c9c222164d8",
        deck: [],
        tableCards: [],
        idAdmin: "17e186c9-a0e4-401f-961f-c54e706dc5c0",
        maxRounds: 5,
        maxPlayers: 10,
        results: [],
        players: [],
        round: 0,
        roundTimeout: 3,
        type: "jp"
      }
    ];
  }

  io.on("connection", (socket) => {
    let idRoom = "";
    let idUser = "";
    let userName = "";

    console.log("connected !");

    socket.on("check-room", data => {
      const room = getRoom(data.idRoom);

      if(room){
        return socket.emit("check-room", {
          idRoom: room.id,
          roomExists: true,
          message: "room exist.",
          idAdmin: room.idAdmin,
          gameReady: !!(room.gameReady),
          maxRounds: room.maxRounds,
          roomIsFull: room.players.length >= room.maxPlayers,
          maxPlayers: room.maxPlayers,
          roundTimeout: room.roundTimeout,
          type: room.type
        } as CheckRoomResponse);
      }

      socket.emit("check-room", { roomExists: false, roomIsFull: false });
    });

    socket.on("create-room", data => {
      const roomPlayer = getRoomPlayer(data.idAdmin);

      if(roomPlayer){
        return socket.emit("create-room",
          { idRoom: roomPlayer.id, message: "player in room.", isCreated: false }
        );
      }

      const id = socket.id;

      io.rooms.push({
        ...data,
        id,
        round: 0,
        deck: [],
        results: [],
        players: [],
        tableCards: [],
        // idAdmin: data.idAdmin
      });

      console.log("room is created", io.rooms);

      socket.emit("create-room", { idRoom: id, message: "room created.", isCreated: true });
    });

    socket.on("message", async (message: PlayerData) => {
      const playerData: PlayerData = message;

      switch (playerData.channel) {
      case "give-up":
        giveUpPlayer(idRoom, idUser);
        break;
      case "confirm-round":
        await handleConfirmRound(idRoom, idUser, playerData?.data?.confirm);
        break;
      case "attack":
        if(idRoom && idUser && userName && playerData.data?.result && playerData.data?.cardsIds){
          if(handleAttack(idUser, playerData.data.result, playerData.data.cardsIds)){
            emitAll(
              idRoom, {
                channel: "attack",
                data: { results: getResultsRoom(idRoom) }
              }
            );

            emit(
              idRoom, idUser, {
                channel: "refresh-hand",
                data: { handCards: await getHandCardsPlayer(idRoom, idUser) }
              }
            );
          }
        }
        break;
      case "finish-round":
        console.log("[finished-round]");

        addWordPlayerInResults(idRoom, idUser, playerData.data.cards as GameCard[]);

        if(getRoom(idRoom)?.endGame){
          console.log("[finished-round] end-game");

          emitAll( //retorna os dados com os pontos torais de cada jogador
            idRoom, {
              channel: "end-game",
              data: getHandCardsPlayers(idRoom)
            } as ServerData<HandCardsPerPlayer[]>
          );
        }

        console.log("result-round");

        emitAll( // retorna results da room, para o front calcular como esta o rank no momento
          idRoom, {
            channel: "result-round",
            data: getResultsRoom(idRoom)
          } as ServerData<Result[]>
        );

        break;
      case "game-start":
        if(isAdmin(idUser, idRoom)){
          startGame(idRoom);
        }
        break;
      case "enter-room":
        idUser = playerData.idUser ?? "";
        idRoom = playerData.idRoom ?? "";
        userName = playerData.name ?? "";

        console.log("enter-room");

        if(addPlayerInRoom(playerData, socket)){
          emitAll(
            idRoom, {
              channel: "players-in-room",
              data: getServerDataPlayerInRoom(idRoom)
            } as ServerData<ServerDataPlayerInRoom[]>
          );
        }
        break;
      case "enter-game":
        console.warn("[enter-game] Try enter game.");

        let isReconnect = false;

        if(!idUser && !idRoom && !userName){
          console.warn("[enter-game] fist entry");

          idUser = playerData.idUser ?? "";
          idRoom = playerData.idRoom ?? "";
          userName = playerData.name ?? "";

          isReconnect = true;
        }else{
          console.warn("[enter-game] game continue");
        }

        if(getRoomPlayer(idUser)){
          let ws;

          if(isReconnect){
            ws = socket;
          }

          const data = getServerDataPlayerInGame(idRoom, idUser, ws);

          if(data){
            console.warn("[enter-game] emit: player-in-game");

            emit(
              idRoom,
              idUser,
                {
                  channel: "player-in-game",
                  data
                } as ServerData<ServerDataPlayerInGame>
            );
          }else{
            console.warn("[enter-game] room not found or gameReady failed");
          }
        }else{
          socket.emit("player-not-found-in-room", {});
          console.warn("[enter-game] Player not found in room");
        }

        break;
      case "set-name":
        userName = playerData.data.name;

        setName(idRoom, idUser, userName);
        emitAll(
          idRoom, {
            channel: "players-in-room",
            data: getServerDataPlayerInRoom(idRoom)
          } as ServerData<ServerDataPlayerInRoom[]>
        );
        break;
      case "set-ready":
        setReady(idRoom, idUser, !!(playerData.data?.isReady));
        emitAll(
          idRoom, {
            channel: "players-in-room",
            data: getServerDataPlayerInRoom(idRoom)
          } as ServerData<ServerDataPlayerInRoom[]>
        );
        break;
      case "game-restart":
        restartGame(idRoom, idUser);

        console.warn("[game-restart] emitAll: game-restart");

        emitAll(
          idRoom,
              {
                channel: "game-restart",
                data: {}
              } as ServerData
        );
        break;
      case "chat-message":
        if(
          userName.trim()
                && typeof playerData.data.message === "string"
                  && playerData.data.message.trim()
        ){
          emitAll(
            idRoom, {
              channel: "chat-message",
              data: { message: `${userName}: ${playerData.data.message}` }
            } as ServerData<DataChat>
          );
        }
        break;
      default:
        break;
      }
    });

    socket.on("disconnect", (code, reason) => {
      console.log("reason: %s:", reason);
      console.log("code: %s:", code);

      removePlayer(idRoom, idUser);

      emitAll(
        idRoom, {
          channel: "players-in-room",
          data: getServerDataPlayerInRoom(idRoom)
        } as ServerData<ServerDataPlayerInRoom[]>
      );
    });
  });

  // ======================= FUNCTIONS PROCESS ==================================

  async function giveUpPlayer(idRoom: string, idPlayer: string){
    connectRoom(idRoom, idPlayer)
      .then(({ room, player }) => {
        const indexPlayer = room.players.indexOf(player);

        if(indexPlayer !== -1){
          room.players.splice(indexPlayer, 1);
        }
      });
  }

  async function handleConfirmRound(idRoom: string, idPlayer: string, confirm: boolean){
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

  function handleAttack(idPlayer: string, result: Result, cardsIds: number[]){
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

  function restartGame(idRoom: string, idPlayer: string){
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

  function startGame(idRoom: string){
    const room = getRoom(idRoom);

    if(room){
      room.gameReady = true;
      room.endGame = false;
      room.jumpRound = false;

      if(room.type === "jp"){
        room.deck = getJpDeckProfile(room.maxPlayers);
      }else{
        room.deck = getDeckProfile(room);
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

  function sumWordPoints(cards: GameCard[]){
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

  function addPlayerInRoom({ idRoom = "", idUser = "", name = "" }: PlayerData, ws: Socket): boolean {
    const room = getRoom(idRoom);

    if(room){
      const playerInRoom = room.players.find(p => p.id === idUser);
      // player reconnect in room

      if(playerInRoom){
        playerInRoom.ws = ws;

        return true;
      }else{
        // quantidade maxima de jogadores
        if(room.players.length <= room.maxPlayers){
          room.players.push({
            ws,
            name,
            cards: [],
            id: idUser,
            isReady: false,
            specialCards: [],
            handCards: []
          });

          return true;
        }

        return false;
      }
    }

    return false;
  }

  function getHandCardsPlayers(idRoom: string): HandCardsPerPlayer[] {
    const room = getRoom(idRoom);

    if(room){
      return room.players.map(p => ({
        idPlayer: p.id,
        handCards: p.handCards,
      }));
    }

    return [];
  }

  function getServerDataPlayerInRoom(idRoom: string): ServerDataPlayerInRoom[] {
    const room = getRoom(idRoom);

    if(room){
      return room.players.map(p => ({
        id: p.id,
        name: p.name,
        image: p.image,
        isReady: p.isReady,
        isOnline: p.isOnline,
        totalScore: p?.totalScore ?? 0,
      })) ?? [];
    }

    return [];
  }

  function getHandCardsPlayer(idRoom: string, idPlayer: string){
    return connectRoom(idRoom, idPlayer).then(({ player }) => {
      return player.handCards;
    }).catch(err => {
      console.log(err);

      return [];
    });
  }

  function getResultsRoom(idRoom: string) {
    const room = getRoom(idRoom);

    if(room){
      room.results.forEach(r => {
        r.score = sumWordPoints(r.cards);
      });

      return room.results;
    }

    return [];
  }

  function addWordPlayerInResults(idRoom: string, idPlayer: string, cards: GameCard[]) {
    console.log("[addWordPlayerInResults] init player:", idPlayer);

    const room = getRoom(idRoom);

    if(room){
      const player = extractPlayerRoom(room, idPlayer);

      if(player){
        console.log("wordCards: ", cards);
        console.log("handCards before: ", player.handCards);

        // remove as cartas usadas da mão
        if(player.handCards.length && cards.length){
          player.handCards = player.handCards.filter(c => !cards.some(cd => c.id === cd.id));
        }

        console.log("handCards after: ", player.handCards);

        room.results.push({
          cards,
          idPlayer,
          round: room.round,
          score: sumWordPoints(cards),
          playerName: player.name ?? "",
        });

        console.log("[addWordPlayerInResults] finish");
      }
    }
  }

  function getServerDataPlayerInGame(idRoom: string, idPlayer: string, ws?: Socket): ServerDataPlayerInGame | undefined {
    const room = getRoom(idRoom);

    if(room && room.gameReady){
      const player = extractPlayerRoom(room, idPlayer);

      if(player){
        const handCards = player?.handCards ?? [];
        const tableCards = room.tableCards;
        const profilePlayersRoom = getServerDataPlayerInRoom(idRoom);

        if(ws){
          player.ws = ws;
        }

        return {
          handCards,
          tableCards,
          profilePlayersRoom,
          results: room.results,
          type:room.type,
          roundTimeout: room.roundTimeout
        };
      }
    }

    console.log("[getServerDataPlayerInGame] - invalid room to player in game", room);

    return undefined;
  }

  function isAdmin(idUser: string, idRoom: string): boolean {
    return getRoom(idRoom)?.idAdmin === idUser;
  }

  function getRoom(idRoom: string){
    return io.rooms.find(r => r.id === idRoom);
  }

  function getRoomPlayer(idPlayer: string){
    return io.rooms.find(r => r.players.some(p => p.id === idPlayer));
  }

  function extractPlayerRoom(room: Room, idPlayer: string){
    return room.players.find(p => p.id === idPlayer);
  }

  function roomExists(idRoom: string){
    return !!(getRoom(idRoom));
  }

  function emitAll(idRoom: string, data: ServerData){
    const room = getRoom(idRoom);

    if(room){
      try {
        room.players.forEach((p) => {
          p.ws.emit(
            "message",
            data
          );
        });
      } catch (error) {
        console.log("[emitAll] Error!");
        console.log("[emitAll- data]: ", data);
        console.log(error);
      }
    }
  }

  function emit(idRoom: string, idPlayer: string, data: ServerData){
    const room = getRoom(idRoom);

    if(room){
      const player = extractPlayerRoom(room, idPlayer);

      if(player){
        player.ws.emit(
          "message",
          data
        );
      }
    }
  }

  function setName(idRoom: string, idPlayer: string, name: string){
    const room = getRoom(idRoom);

    if(room){
      room.players.forEach(player => {
        if(player.id === idPlayer){
          player.name = name;
        }
      });
    }
  }

  function setReady(idRoom: string, idPlayer: string, isReady: boolean){
    const room = getRoom(idRoom);

    if(room){
      room.players.forEach(player => {
        if(player.id === idPlayer){
          player.isReady = isReady;
        }
      });
    }
  }

  function removePlayer(idRoom: string, idPlayer: string){
    const room = getRoom(idRoom);

    if(room && !room.gameReady){
      const indexPlayer = room?.players.findIndex(p => p.id === idPlayer);

      if(indexPlayer !== -1){
        // só remove o jogador caso o jogo não tenha começado
        room.players.splice(indexPlayer, 1);
        console.log("player removed from room");
      }
    }
  }

  function connectRoom(idRoom: string, idPlayer: string){
    return new Promise<{ room: Room, player: PlayerRoom }>((resolve, reject) => {
      const room = getRoom(idRoom);

      if(room){
        if(idPlayer){
          const player = extractPlayerRoom(room, idPlayer);

          if(player){
            resolve({ room, player });
          }

          reject("player not found");
        }
      }

      reject("room not found");
    });
  }

  type DeckCard = Record<string, GameCard>;

  const Vowels: GameCard["value"][] = ["A", "E", "I", "O", "U"];
  const specialLatters = ["Á", "Â", "Ã", "Í", "Ú", "Ê", "É", "Ó", "Ô", "Õ"];
  const specialDic = { "Á": "´", "Â": "^", "Ã": "~", "Í": "´", "Ú": "´", "Ê": "^", "É": "´", "Ó": "´", "Ô": "^", "Õ": "~" };
  // const vowelsSpecialDic = {"A": ["Á", "Â", "Ã", "A"], "I": ["Í"], "U": ["Ú", "U"], "E": ["É", "Ê", "E"], "O": ["Ó", "Ô", "Õ", "O"]};
  const vowelsSpecialDic = {
    "A": {
      "´": "Á",
      "^": "Â",
      "~": "Ã"
    },
    "E": {
      "´": "É",
      "^": "Ê",
      "~": "Ẽ"
    },
    "I": {
      "´": "Í",
      "^": "Î",
      "~": "ĩ"
    },
    "O": {
      "´": "Ó",
      "^": "Ô",
      "~": "Õ"
    },
    "U": {
      "´": "Ú",
      "^": "Û",
      "~": "Ũ"
    },
  };
  const special = ["´", "^", "~"];

  const Cards: DeckCard = {
    A:{
      value: "A",
      points: 1
    },
    B:{
      value: "B",
      points: 3
    },
    C:{
      value: "C",
      points: 3
    },
    "Ç":{
      value: "Ç",
      points: 2
    },
    D:{
      value: "D",
      points: 2
    },
    E:{
      value: "E",
      points: 1
    },
    F:{
      value: "F",
      points: 4
    },
    G:{
      value: "G",
      points: 2
    },
    H:{
      value: "H",
      points: 4
    },
    I:{
      value: "I",
      points: 1
    },
    J:{
      value: "J",
      points: 8
    },
    L:{
      value: "L",
      points: 1
    },
    M:{
      value: "M",
      points: 3
    },
    N:{
      value: "N",
      points: 1
    },
    O:{
      value: "O",
      points: 1
    },
    P:{
      value: "P",
      points: 3
    },
    Q:{
      value: "Q",
      points: 5
    },
    R:{
      value: "R",
      points: 1
    },
    S:{
      value: "S",
      points: 1
    },
    T:{
      value: "T",
      points: 1
    },
    U:{
      value: "U",
      points: 1
    },
    V:{
      value: "V",
      points: 4
    },
    X:{
      value: "X",
      points: 8
    },
    Z:{
      value: "Z",
      points: 10
    },
    "?":{
      value: "?",
      points: 10,
      isJoker: true
    },
    ATK:{
      value: "ATK",
      points: 1
    },
  };

  function getCardsLatters() {
    const cardsLatters = [] as GameCard[];

    Object.keys(Cards).map(k => {
      if(Cards[k].value !== "ATK" && Cards[k].value !== "?"){
        cardsLatters.push({ ...Cards[k] });
      }
    });

    return cardsLatters;
  }

  function showWord(cards: GameCard[]){
    let word = "";

    cards.forEach(c => {
      if(c.jokerValue){
        word += c.jokerValue;
      }else if(c.acc){
        // @ts-ignore
        word += vowelsSpecialDic[c.value][c.acc];
      }
    });

    return word;
  }

  function getTableCards(deck: GameCard[]){
    const table = [];

    for (let i = 0; i < deck.length && table.length !== 4; i++) {
      if(deck[i].value !== "ATK" && deck[i].value !== "?"){
        table.push(deck[i]);
        deck.splice(i, 1);
      }
    }

    return { table, deck };
  }

  function getNextCard(deck: GameCard[]){
    const card = deck[0];

    deck.shift();

    return { card, deck };
  }

  function getHand(deck: GameCard[]){
    const hand = [];

    for(let i in Array.from(Array(7))){
      hand.push(deck[0]);
      deck.shift();
    }

    return { hand, deck };
  }

  function getCardShield(deckSize: number, type: Room["type"]) {
    let cardsLatters = type === "jp" ? getJpCardsLatters() : getCardsLatters();
    const shieldCard = cardsLatters[Math.floor(Math.random() * cardsLatters.length)];

    shieldCard.isShield = true;
    shieldCard.id = deckSize * 10;
    shieldCard.points = 10;

    return shieldCard;
  }

  function getJpDeckProfile(maxPlayers: number){
    let atk = 14, joker = 13;

    if(maxPlayers >= 2 && maxPlayers <= 4){
      atk = 14;
      joker = 13;
    }
    else if(maxPlayers > 4 && maxPlayers <= 6){
      atk = 19;
      joker = 18;
    }
    else if(maxPlayers > 6 && maxPlayers <= 8){
      atk = 23;
      joker = 22;
    }
    else{
      atk = 27;
      joker = 26;
    }

    return createJpDeck({ atk, joker, maxPlayers });
  }

  function getDeckProfile(room: Room){
    const { type, maxPlayers } = room;

    let config = { atk: 14, consonants: 3, joker: 13, vowels: 7 };

    if(maxPlayers >= 2 && maxPlayers <= 4){
      config = { atk: 14, consonants: 3, joker: 13, vowels: 7 };
    }
    else if(maxPlayers > 4 && maxPlayers <= 6){
      config = { atk: 19, consonants: 4, joker: 18, vowels: 9 };
    }
    else if(maxPlayers > 6 && maxPlayers <= 8){
      config = { atk: 23, consonants: 5, joker: 22, vowels: 10 };
    }
    else{
      config = { atk: 27, consonants: 6, joker: 26, vowels: 13 };
    }

    if(type === "en"){
      return createDeckEn(config);
    }

    return createDeck(config);
  }

  function createJpDeck({ joker, atk, maxPlayers }: JpDeckConfig){
    let deck: GameCard[] = [];

    const getCard = (value: string) => ({ ...JpCards[value] });

    Array.from(Array((maxPlayers * 2) + 1)).forEach(() =>
      deck = [...deck, ...getJpCardsLatters()]
    );

    Array.from(Array(joker)).forEach(() =>
      deck.push(getCard("?"))
    );

    Array.from(Array(atk)).forEach(() =>
      deck.push(getCard("ATK"))
    );

    // add ids
    deck.forEach((c, i) => { c.id = i; });

    return shuffle<GameCard>(deck);
  }

  /* deck básico: 3 vogais de cada, 2 consoantes, 4 atk, 4 coringas */
  function createDeck({ vowels, consonants, joker, atk }: DeckConfig){
    const deck: GameCard[] = [];

    const getCardCopy = (value: string) => ({ ...Cards[value] });

    for(let i in Array.from(Array(vowels))){
      Vowels.forEach(v => deck.push(getCardCopy(v)));
    }

    for(let i in Array.from(Array(consonants))){
      Object.keys(Cards).forEach(k => {
        if(!Vowels.includes(k) && k !== "?" && k !== "ATK"){
          deck.push(getCardCopy(k));
        }
      });
    }

    for(let i in Array.from(Array(joker))){
      deck.push(getCardCopy("?"));
    }

    for(let i in Array.from(Array(atk))){
      deck.push(getCardCopy("ATK"));
    }

    // add ids
    deck.forEach((c, i) => { c.id = i; });

    return shuffle<GameCard>(deck);
  }

  /* deck básico: 3 vogais de cada, 2 consoantes, 4 atk, 4 coringas */
  function createDeckEn({ vowels, consonants, joker, atk }: DeckConfig){
    const deck: GameCard[] = [];

    const getCard = (value: string) => ({ ...Cards[value] });

    for(let i in Array.from(Array(vowels))){
      Vowels.forEach(v => deck.push(getCard(v)));
    }

    for(let i in Array.from(Array(consonants))){
      Object.keys(Cards).forEach(k => {
        if(!Vowels.includes(k) && k !== "?" && k !== "ATK" && k !== "Ç"){
          deck.push(getCard(k));
        }
      });

      deck.push({
        value: "K",
        points: 3
      });

      deck.push({
        value: "Y",
        points: 3
      });
    }

    for(let i in Array.from(Array(joker))){
      deck.push(getCard("?"));
    }

    for(let i in Array.from(Array(atk))){
      deck.push(getCard("ATK"));
    }

    // add ids
    deck.forEach((c, i) => { c.id = i; });

    return shuffle<GameCard>(deck);
  }

  function shuffle<T = any>(arr: Array<T>){
    return arr.map(v => ({ v, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ v }) => v);
  }

  const JpCards: DeckCard = {
    A:{
      value: "あ",
      points: 1,
      sp: ["ア"],
    },
    I:{
      value: "い",
      points: 1,
      sp: ["イ"]
    },
    U:{
      value: "う",
      points: 1,
      sp: ["ウ"]
    },
    E:{
      value: "え",
      points: 1,
      sp: ["エ"]
    },
    O:{
      value: "お",
      points: 1,
      sp: ["オ"]
    },
    KA:{
      value: "か",
      points: 1,
      sp: ["カ", "が", "ガ"]
    },
    KI:{
      value: "き",
      points: 1,
      sp: ["キ", "ぎ", "ギ"]
    },
    KU:{
      value: "く",
      points: 1,
      sp: ["ク", "ぐ", "グ"]
    },
    KE:{
      value: "け",
      points: 1,
      sp: ["ケ", "げ", "ゲ"]
    },
    KO:{
      value: "こ",
      points: 2,
      sp: ["コ", "ご", "ゴ"]
    },
    SA:{
      value: "さ",
      points: 2,
      sp: ["サ", "ご", "ざ"]
    },
    SHI:{
      value: "し",
      points: 2,
      sp: ["じ", "シ", "ジ"]
    },
    SU:{
      value: "す",
      points: 2,
      sp: ["ず", "ス", "ズ"]
    },
    SE:{
      value: "せ",
      points: 2,
      sp: ["ぜ", "セ", "ゼ"]
    },
    SO:{
      value: "そ",
      points: 1,
      sp: ["ぞ", "ソ", "ゾ"]
    },
    TA:{
      value: "た",
      points: 3,
      sp: ["だ", "タ", "ダ"]
    },
    CHI:{
      value: "ち",
      points: 5,
      sp: ["ぢ", "チ", "ヂ"]
    },
    TSU:{
      value: "つ",
      points: 2,
      sp: ["づ", "っ", "ツ", "ッ", "ヅ"]
    },
    TE:{
      value: "て",
      points: 1,
      sp: ["で", "テ", "デ"]
    },
    TO:{
      value: "と",
      points: 1,
      sp: ["ど", "ト", "ド"]
    },
    NA:{
      value: "な",
      points: 1,
      sp: ["ナ"]
    },
    NI:{
      value: "に",
      points: 4,
      sp: ["ニ"]
    },
    NU:{
      value: "ぬ",
      points: 5,
      sp: ["ヌ"]
    },
    NE:{
      value: "ね",
      points: 5,
      sp: ["ネ"]
    },
    NO:{
      value: "の",
      points: 1,
      sp: ["ノ"]
    },
    HA:{
      value: "は",
      points: 1,
      sp: ["ば", "ぱ", "ハ", "バ", "パ"]
    },
    HI:{
      value: "ひ",
      points: 2,
      sp: ["び", "ぴ", "ヒ", "ビ", "ピ"]
    },
    HU:{
      value: "ふ",
      points: 8,
      sp: ["ぶ", "ぷ", "フ", "ブ", "プ"]
    },
    HE:{
      value: "へ",
      points: 1,
      sp: ["べ", "ぺ", "ヘ", "ベ", "ペ"]
    },
    HO:{
      value: "ほ",
      points: 1,
      sp: ["ぼ", "ぽ", "ホ", "ボ", "ポ"]
    },
    MA:{
      value: "ま",
      points: 1,
      sp: ["マ"]
    },
    MI:{
      value: "み",
      points: 1,
      sp: ["ミ"]
    },
    MU:{
      value: "む",
      points: 8,
      sp: ["ム"]
    },
    ME:{
      value: "め",
      points: 1,
      sp: ["メ"]
    },
    MO:{
      value: "も",
      points: 1,
      sp: ["モ"]
    },
    YA:{
      value: "や",
      points: 3,
      sp: ["ヤ", "ゃ", "ャ"]
    },
    YU:{
      value: "ゆ",
      points: 3,
      sp: ["ユ", "ゅ", "ュ"]
    },
    YO:{
      value: "よ",
      points: 3,
      sp: ["ヨ", "ょ", "ョ"]
    },
    RA:{
      value: "ら",
      points: 1,
      sp: ["ラ"]
    },
    RI:{
      value: "り",
      points: 4,
      sp: ["リ"]
    },
    RU:{
      value: "る",
      points: 5,
      sp: ["ル"]
    },
    RE:{
      value: "れ",
      points: 5,
      sp: ["レ"]
    },
    RO:{
      value: "ろ",
      points: 1,
      sp: ["ロ"]
    },
    WA:{
      value: "わ",
      points: 10,
      sp: ["ワ"]
    },
    WO:{
      value: "を",
      points: 10,
      sp: ["ヲ"]
    },
    N:{
      value: "ん",
      points: 1,
      sp: ["ン"]
    },
    "?":{
      value: "?",
      points: 10,
      isJoker: true
    },
    ATK:{
      value: "ATK",
      points: 1
    },
  };

  function getJpCardsLatters() {
    const cardsLatters = [] as GameCard[];

    Object.keys(JpCards).map(k => {
      if(JpCards[k].value !== "ATK" && JpCards[k].value !== "?"){
        cardsLatters.push({ ...JpCards[k] });
      }
    });

    return cardsLatters;
  }

  function jpShowWord(cards: GameCard[]){
    let word = "";

    cards.forEach(c => {
      if(c.jokerValue){
        word += c.jokerValue;
      }else if(c.finalValue){
        word += c.finalValue;
      }else{
        word += c.value;
      }
    });

    return word;
  }

  interface DeckConfig {
    vowels: number;
    consonants: number;
    joker: number;
    atk: number;
  }

  interface JpDeckConfig {
    joker: number;
    atk: number;
    maxPlayers: number;
  }
}

