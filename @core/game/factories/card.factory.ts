/* eslint-disable @typescript-eslint/no-extraneous-class */
import Card, { type CardProps } from "../entities/card.entity";

export default class CardFactory {
  static buildVowels(): Card[] {
    return [
      Card.create({ value: "A", points: 1, variations: [
        { value: "Á", points: 3 },
        { value: "Â", points: 3 },
        { value: "Ã", points: 3 },
      ]} as CardProps),
      Card.create({ value: "E", points: 1, variations: [
        { value: "É", points: 3 },
        { value: "Ê", points: 3 },
      ]} as CardProps),
      Card.create({ value: "I", points: 1, variations: [
        { value: "Í", points: 3 },
      ]} as CardProps),
      Card.create({ value: "O", points: 1, variations: [
        { value: "Ó", points: 3 },
        { value: "Ô", points: 3 },
        { value: "Õ", points: 3 },
      ] } as CardProps),
      Card.create({ value: "U", points: 1, variations: [
        { value: "Ú", points: 3 },
      ] } as CardProps),
    ];
  }

  static buildConsonants(): Card[] {
    return [
      Card.create({ value: "B", points: 3 } as CardProps),
      Card.create({ value: "C", points: 3 } as CardProps),
      Card.create({ value: "Ç", points: 2 } as CardProps),
      Card.create({ value: "D", points: 2 } as CardProps),
      Card.create({ value: "F", points: 4 } as CardProps),
      Card.create({ value: "G", points: 2 } as CardProps),
      Card.create({ value: "H", points: 4 } as CardProps),
      Card.create({ value: "J", points: 8 } as CardProps),
      Card.create({ value: "L", points: 1 } as CardProps),
      Card.create({ value: "M", points: 3 } as CardProps),
      Card.create({ value: "N", points: 1 } as CardProps),
      Card.create({ value: "P", points: 3 } as CardProps),
      Card.create({ value: "Q", points: 5 } as CardProps),
      Card.create({ value: "R", points: 1 } as CardProps),
      Card.create({ value: "S", points: 1 } as CardProps),
      Card.create({ value: "T", points: 1 } as CardProps),
      Card.create({ value: "V", points: 4 } as CardProps),
      Card.create({ value: "X", points: 8 } as CardProps),
      Card.create({ value: "Z", points: 10 } as CardProps),
    ];
  }

  static buildJoker(): Card {
    return Card.create({ value: "?", points: 0, isJoker: true } as CardProps);
  }

  static buildAtk(): Card {
    return Card.create({ value: "ATK", points: 1 } as CardProps);
  }

  static buildJaponeseVowels(): Card[] {
    return [
      Card.create({ value: "あ", points: 1 } as CardProps),
      Card.create({ value: "い", points: 1 } as CardProps),
      Card.create({ value: "う", points: 1 } as CardProps),
      Card.create({ value: "え", points: 1 } as CardProps),
      Card.create({ value: "お", points: 1 } as CardProps),
    ]
  }

  static buildJaponeseConsonants(): Card[] {
    return [
      Card.create({
        value: "か",
        points: 1,
        variations: [
          { value: "が", points: 1 }, 
          { value: "っか", points: 1 }, 
          { value: "カ", points: 1 }, 
          { value: "ガ", points: 1 }, 
        ],
      } as CardProps),

      Card.create({
        value: "き",
        points: 1,
        variations: [
          { value: "ぎ", points: 1 },
          { value: "っき", points: 1 },
          { value: "ぎゃ", points: 1 },
          { value: "ぎゅ", points: 1 },
          { value: "ぎょ", points: 1 },
          { value: "キ", points: 1 },
          { value: "ギ", points: 1 },
        ],
      } as CardProps),

      Card.create({
        value: "く",
        points: 1,
        variations: [
          { value: "ぐ", points: 1 },
          { value: "っく", points: 1 },
          { value: "ク", points: 1 },
          { value: "グ", points: 1 },
        ],
      } as CardProps),

      Card.create({
        value: "け",
        points: 1,
        variations: [
          { value: "げ", points: 1 },
          { value: "っけ", points: 1 },
          { value: "ケ", points: 1 },
          { value: "ゲ", points: 1 },
        ],
      } as CardProps),

      Card.create({
        value: "こ",
        points: 2,
        variations: [
          { value: "ご", points: 1 },
          { value: "っこ", points: 1 },
          { value: "コ", points: 1 },
          { value: "ゴ", points: 1 },
        ],
      } as CardProps),

      Card.create({ value: "さ", points: 2, variations: [
        { value: "ざ", points: 1 },
        { value: "サ", points: 1 },
        { value: "ザ", points: 1 },
      ] } as CardProps),
      Card.create({ value: "し", points: 2 } as CardProps),
      Card.create({ value: "す", points: 2 } as CardProps),
      Card.create({ value: "せ", points: 2 } as CardProps),
      Card.create({ value: "そ", points: 1 } as CardProps),
      
      Card.create({ value: "た", points: 1 } as CardProps),
      Card.create({ value: "ち", points: 3 } as CardProps),
      Card.create({ value: "つ", points: 3 } as CardProps),
      Card.create({ value: "て", points: 1 } as CardProps),
      Card.create({ value: "と", points: 1 } as CardProps),
      
      Card.create({ value: "な", points: 1 } as CardProps),
      Card.create({ value: "に", points: 1 } as CardProps),
      Card.create({ value: "ぬ", points: 1 } as CardProps),
      Card.create({ value: "ね", points: 1 } as CardProps),
      Card.create({ value: "の", points: 1 } as CardProps),
      
      Card.create({ value: "は", points: 4 } as CardProps),
      Card.create({ value: "ひ", points: 4 } as CardProps),
      Card.create({ value: "ふ", points: 4 } as CardProps),
      Card.create({ value: "へ", points: 5 } as CardProps),
      Card.create({ value: "ほ", points: 4 } as CardProps),
      
      Card.create({ value: "ま", points: 8 } as CardProps),
      Card.create({ value: "み", points: 8 } as CardProps),
      Card.create({ value: "む", points: 8 } as CardProps),
      Card.create({ value: "め", points: 8 } as CardProps),
      Card.create({ value: "も", points: 8 } as CardProps),
      
      Card.create({ value: "や", points: 10 } as CardProps),
      Card.create({ value: "ゆ", points: 10 } as CardProps),
      Card.create({ value: "よ", points: 10 } as CardProps),
      
      Card.create({ value: "ら", points: 1 } as CardProps),
      Card.create({ value: "り", points: 1 } as CardProps),
      Card.create({ value: "る", points: 1 } as CardProps),
      Card.create({ value: "れ", points: 1 } as CardProps),
      Card.create({ value: "ろ", points: 1 } as CardProps),
      
      Card.create({ value: "わ", points: 10 } as CardProps),
      Card.create({ value: "を", points: 10 } as CardProps),
      Card.create({ value: "ん", points: 1 } as CardProps),
    ]
  }

  static buildLetters(): Card[] {
    return [
      ...CardFactory.buildVowels(),
      ...CardFactory.buildConsonants(),
    ]
  }

  static buildJaponeseLetters(): Card[] {
    return [
      ...CardFactory.buildJaponeseVowels(),
      ...CardFactory.buildJaponeseConsonants(),
    ]
  }
}