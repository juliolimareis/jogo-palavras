import Entity, { type EntityProps } from "../../common/entities/entity";
import type { CardProps } from "./card.entity";
import Card from "./card.entity";

export type DeckProps = EntityProps & {
  cards?: CardProps[];
}

export enum DeckType {
  EN,
  PT,
  JP
}

export default class Deck extends Entity {
  private _cards: Card[];

  constructor(props?: DeckProps){
    super(props);
    
    this._cards = Array.isArray(props?.cards) ? props.cards.map(c => Card.create(c)): [];
  }

  draw(): Card | null {
    if(this._cards.length){
      const card = this._cards[0] as Card;
      this._cards.shift();
  
      return card;
    }

    return null;
  }

  addCard(...cards: Card[]): void {
    this._cards.push(...cards);
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

  override toJson(): DeckProps {
    return {
      ...super.toJson(),
      cards: this._cards.map(c => c.toJson()),
    };
  }

  override toString(): string {
    return JSON.stringify(this.toJson(), null, 2);
  }

  static override create(command?: DeckProps){
    return new Deck(command);
  }
}

export class DeckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeckError";
  }
}