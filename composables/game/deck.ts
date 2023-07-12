import { Vowels, Cards, getCardsLatters, } from "./cards";

export function getTableCards(deck: GameCard[]){
  const table = [];

  for (let i = 0; i < deck.length && table.length !== 4; i++) {
    if(deck[i].value !== "ATK" && deck[i].value !== "?"){
      table.push(deck[i]);
      deck.splice(i, 1);
    }
  }

  return { table, deck };
}

export function getNextCard(deck: GameCard[]){
  const card = deck[0];

  deck.shift();

  return { card, deck };
}

export function getHand(deck: GameCard[]){
  const hand = [];

  for(let i in Array.from(Array(7))){
    hand.push(deck[0]);
    deck.shift();
  }

  return { hand, deck };
}

export function getCardShield(deckSize: number) {
  const cardsLatters = getCardsLatters();
  const shieldCard = cardsLatters[Math.floor(Math.random() * cardsLatters.length)];

  shieldCard.isShield = true;
  shieldCard.id = deckSize * 10;
  shieldCard.points = 10;

  return shieldCard;
}

export function getDeckProfile(maxPlayers: number){
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

  return createDeck(config);
}

/* deck básico: 3 vogais de cada, 2 consoantes, 4 atk, 4 coringas */
export function createDeck({ vowels, consonants, joker, atk }: DeckConfig){
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

export function shuffle<T = any>(arr: Array<T>){
  return arr.map(v => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ v }) => v);
}

interface DeckConfig {
  vowels: number;
  consonants: number;
  joker: number;
  atk: number;
}