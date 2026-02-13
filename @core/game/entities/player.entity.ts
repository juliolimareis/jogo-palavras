import Card, { type CardProps } from "./card.entity";
import Entity from "~/@core/common/entities/entity";
import type { EntityProps } from "~/@core/common/entities/entity";

export type PlayerProps = EntityProps & {
  name?: string;
  image?: string;
  isReady?: boolean;
  isOnline?: boolean;
  totalScore?: number;
  cards?: CardProps[];
  confirmRound?: boolean;
  specialCards?: CardProps[];
}

export default class Player extends Entity {
  private _cards: Card[];
  
  name: string;
  imageUrl: string;
  isReady: boolean;
  isOnline: boolean;
  confirmRound: boolean;
  isDisabled: boolean;

  constructor(props?: PlayerProps){
    super(props);

    this.name = props?.name ?? "";
    this.imageUrl = props?.image ?? "";
    this.isReady = !!(props?.isReady);
    this.isOnline = !!(props?.isOnline);
    this.confirmRound = !!(props?.confirmRound);
    this.isDisabled = false;
    this._cards = Array.isArray(props?.cards) ? props.cards.map(c => Card.create(c)): [];
  }

  get cards(): Card[] {
    return this._cards;
  }

  get haveShield(): boolean {
    return this._cards.some(c => c.isShield);
  }

  addCard(...cards: Card[]): void {
    this._cards.push(...cards);
  }

  removeCard(card: Card): void {
    const index = this._cards.findIndex(c => c.id === card.id);

    if(index !== -1){
      this._cards.splice(index, 1);
    }
  }

  override toJson(): PlayerProps {
    return {
      ...super.toJson(),
      name: this.name,
      image: this.imageUrl,
      isReady: this.isReady,
      isOnline: this.isOnline,
      confirmRound: this.confirmRound,
      cards: this._cards.map(c => c.toJson()), 
    };
  }

  override toString(): string {
    return JSON.stringify(this.toJson(), null, 2);
  }

  static override create(command: PlayerProps){
    return new Player(command);
  }

}