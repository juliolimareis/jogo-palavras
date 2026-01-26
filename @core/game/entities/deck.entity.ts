import Entity, { type EntityProps } from "~/@core/common/entities/entity";
import type { CardProps } from "./card.entity";
import Card from "./card.entity";
import CardFactory from "../factories/card.factory";

type DeckProps = EntityProps & {
  cards: CardProps[];
  usedCards: CardProps[];
  vowels?: number;
  consonants?: number;
  joker?: number;
  atk?: number;
  maxPlayers?: number;
  type?: DeckType;
}

export enum DeckType {
  EN,
  PT,
  JP
}

export default class Deck extends Entity {
  private _cards: Card[];
  private _usedCards: Card[];

   _vowels: number;
   _consonants: number;
   _joker: number;
   _atk: number;
   
   readonly maxPlayers: number;
   readonly type: DeckType;

  constructor(props: DeckProps){
    super(props);
    
    if(!props.type){
      throw new DeckError("DeckType is required.");
    }

    if(props.maxPlayers && !isNaN(Number(props.maxPlayers)) && props.maxPlayers > 8){
      throw new DeckError("MaxPlayers must be between 1 and 8.");
    }

    this.type = props.type;
    this._atk = props.atk ?? 0;
    this._joker = props.joker ?? 0;
    this._vowels = props.vowels ?? 0;
    this.maxPlayers = props.maxPlayers ?? 1;
    this._consonants = props.consonants ?? 0;

    this._cards = Array.isArray(props.cards) ? props.cards.map(c => Card.create(c)): [];
    this._usedCards = Array.isArray(props.usedCards) ? props.usedCards.map(c => Card.create(c)): [];
  }

  buildDeck(){
    let config = { atk: 14, consonants: 3, joker: 13, vowels: 7 };

    if(this.maxPlayers >= 2 && this.maxPlayers <= 4){
      config = { atk: 14, consonants: 3, joker: 13, vowels: 7 };
    }

    else if(this.maxPlayers > 4 && this.maxPlayers <= 6){
      config = { atk: 19, consonants: 4, joker: 18, vowels: 9 };
    }

    else if(this.maxPlayers > 6 && this.maxPlayers <= 8){
      config = { atk: 23, consonants: 5, joker: 22, vowels: 10 };
    }
    
    else if(this.maxPlayers === 8){
      config = { atk: 27, consonants: 6, joker: 26, vowels: 13 };
    }

    this._vowels = config.vowels;
    this._consonants = config.consonants;
    this._joker = config.joker;
    this._atk = config.atk;

    return this.createDeck();
  }

  private createDeck(){
    Array(this._vowels).forEach(() =>
      this.cards.push(...CardFactory.buildVowels())
    );

    Array(this._consonants).forEach(() =>
      this.cards.push(...CardFactory.buildConsonants())
    );

    Array(this._joker).forEach(() =>
      this.cards.push(CardFactory.buildJoker())
    );

    Array(this._atk).forEach(() =>
      this.cards.push(CardFactory.buildJoker())
    );

    return this.shuffle();
  }

  draw(){
    if(!this._cards.length){
      throw new DeckError("Deck is empty.")
    }

    const card = this._cards[0] as Card;
    this._usedCards.push(card);
    this._cards.shift();

    return card;
  }

  shuffle(){
    this._cards = this._cards.map(v => ({ v, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ v }) => v);
  }

  get cards(): Card[] {
    return this._cards;
  }

  get size(): number {
    return this._cards.length;
  }

  get vowels(): number {
    return this._vowels;
  }

  get consonants(): number {
    return this._consonants;
  }

  get joker(): number {
    return this._joker;
  }

  get atk(): number {
    return this._atk;
  }

  override toJson(): DeckProps {
    return {
      ...super.toJson(),
      vowels: this._vowels,
      consonants: this._consonants,
      joker: this._joker,
      atk: this._atk,
      cards: this._cards.map(c => c.toJson()),
      usedCards: this._usedCards.map(c => c.toJson()),
      maxPlayers: this.maxPlayers,
      type: this.type
    };
  }

  override toString(): string {
    return JSON.stringify(this.toJson(), null, 2);
  }

  static create(command: DeckProps){
    return new Deck(command);
  }
}

export class DeckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeckError";
  }
}