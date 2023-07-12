type DeckCard = Record<string, GameCard>;

export const Vowels: GameCard["value"][] = ["A", "E", "I", "O", "U"];
export const specialLatters = ["Á", "Â", "Ã", "Í", "Ú", "Ê", "É", "Ó", "Ô", "Õ"];
export const specialDic = {"Á": "´", "Â": "^", "Ã": "~", "Í": "´", "Ú": "´", "Ê": "^", "É": "´", "Ó": "´", "Ô": "^", "Õ": "~"};
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
}  
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


export const hiragana = {
  あ: {
    'value': 'あ',
    'points': 1
  },
  い: {
    'value': 'い',
    'points': 1
  },
  う: {
    'value': 'う',
    'points': 1
  },
  え: {
    'value': 'え',
    'points': 1
  },
  お: {
    'value': 'お',
    'points': 1
  },
  か: {
    'value': 'か',
    'points': 1
  },
  き: {
    'value': 'き',
    'points': 1
  },
  く: {
    'value': 'く',
    'points': 1
  },
  け: {
    'value': 'け',
    'points': 1
  },
  こ: {
    'value': 'こ',
    'points': 1
  },
  さ: {
    'value': 'さ',
    'points': 1
  },
  し: {
    'value': 'し',
    'points': 1
  },
  す: {
    'value': 'す',
    'points': 1
  },
  せ: {
    'value': 'せ',
    'points': 1
  },
  そ: {
    'value': 'そ',
    'points': 1
  },
  た: {
    'value': 'た',
    'points': 1
  },
  ち: {
    'value': 'ち',
    'points': 1
  },
  つ: {
    'value': 'つ',
    'points': 1
  },
  て: {
    'value': 'て',
    'points': 1
  },
  と: {
    'value': 'と',
    'points': 1
  },
  な: {
    'value': 'な',
    'points': 1
  },
  に: {
    'value': 'に',
    'points': 1
  },
  ぬ: {
    'value': 'ぬ',
    'points': 1
  },
  ね: {
    'value': 'ね',
    'points': 1
  },
  の: {
    'value': 'の',
    'points': 1
  },
  は: {
    'value': 'は',
    'points': 1
  },
  ひ: {
    'value': 'ひ',
    'points': 1
  },
  ふ: {
    'value': 'ふ',
    'points': 1
  },
  へ: {
    'value': 'へ',
    'points': 1
  },
  ほ: {
    'value': 'ほ',
    'points': 1
  },
  ま: {
    'value': 'ま',
    'points': 1
  },
  み: {
    'value': 'み',
    'points': 1
  },
  む: {
    'value': 'む',
    'points': 1
  },
  め: {
    'value': 'め',
    'points': 1
  },
  も: {
    'value': 'も',
    'points': 1
  },
  や: {
    'value': 'や',
    'points': 1
  },
  ゆ: {
    'value': 'ゆ',
    'points': 1
  },
  よ: {
    'value': 'よ',
    'points': 1
  },
  ら: {
    'value': 'ら',
    'points': 1
  },
  り: {
    'value': 'り',
    'points': 1
  },
  る: {
    'value': 'る',
    'points': 1
  },
  れ: {
    'value': 'れ',
    'points': 1
  },
  ろ: {
    'value': 'ろ',
    'points': 1
  },
  わ: {
    'value': 'わ',
    'points': 1
  },
  を: {
    'value': 'を',
    'points': 1
  },
  ん: {
    'value': 'ん',
    'points': 1
  }
}



export function getCardsLatters() {
  const cardsLatters = [] as GameCard[];
  
  Object.keys(Cards).map(k => {
    if(Cards[k].value !== "ATK" && Cards[k].value !== "?"){
      cardsLatters.push({ ...Cards[k]});
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
      word += vowelsSpecialDic[c.value][c.acc];
    }
  });

  return word;
}