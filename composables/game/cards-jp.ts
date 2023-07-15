type DeckCard = Record<string, GameCard>;

export const JpCards: DeckCard = {
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

export function getJpCardsLatters() {
  const cardsLatters = [] as GameCard[];

  Object.keys(JpCards).map(k => {
    if(JpCards[k].value !== "ATK" && JpCards[k].value !== "?"){
      cardsLatters.push({ ...JpCards[k] });
    }
  });

  return cardsLatters;
}

export function jpShowWord(cards: GameCard[]){
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