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
  handCards?: CardProps[];
  specialCards?: CardProps[];
}

export default class Player extends Entity {
  private _cards: Card[];
  private _handCards: Card[];
  private _specialCards: Card[];
  
  name: string;
  imageUrl: string;
  isReady: boolean;
  isOnline: boolean;
  confirmRound: boolean;

  constructor(props?: PlayerProps){
    super(props);
    this.name = props?.name ?? "";
    this.imageUrl = props?.image ?? "";
    this.isReady = props?.isReady ?? false;
    this.isOnline = props?.isOnline ?? true;
    this.confirmRound = props?.confirmRound ?? false;
    this._cards = Array.isArray(props?.cards) ? props.cards.map(c => Card.create(c)): [];
    this._handCards = Array.isArray(props?.handCards) ? props?.handCards.map(c => Card.create(c)): [];
    this._specialCards = Array.isArray(props?.specialCards) ? props?.specialCards.map(c => Card.create(c)): [];
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
      handCards: this._handCards.map(c => c.toJson()),
      specialCards: this._specialCards.map(c => c.toJson()),
    };
  }

  override toString(): string {
    return JSON.stringify(this.toJson(), null, 2);
  }

  static create(command: PlayerProps){
    return new Player(command);
  }

}