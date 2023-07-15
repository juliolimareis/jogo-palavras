type DeckCard = Record<string, GameCard>;

export const Vowels: GameCard["value"][] = ["A", "E", "I", "O", "U"];
export const specialLatters = ["Á", "Â", "Ã", "Í", "Ú", "Ê", "É", "Ó", "Ô", "Õ"];
export const specialDic = { "Á": "´", "Â": "^", "Ã": "~", "Í": "´", "Ú": "´", "Ê": "^", "É": "´", "Ó": "´", "Ô": "^", "Õ": "~" };
// export const vowelsSpecialDic = {"A": ["Á", "Â", "Ã", "A"], "I": ["Í"], "U": ["Ú", "U"], "E": ["É", "Ê", "E"], "O": ["Ó", "Ô", "Õ", "O"]};
export const vowelsSpecialDic = {
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
export const special = ["´", "^", "~"];

export const Cards: DeckCard = {
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

export function getCardsLatters() {
  const cardsLatters = [] as GameCard[];

  Object.keys(Cards).map(k => {
    if(Cards[k].value !== "ATK" && Cards[k].value !== "?"){
      cardsLatters.push({ ...Cards[k] });
    }
  });

  return cardsLatters;
}

export function showWord(cards: GameCard[]){
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