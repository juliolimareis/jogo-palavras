import Entity from "~/@core/common/entities/entity";
import type { CardProps } from "./card.entity";
import Player, { type PlayerProps } from "./player.entity";
import type { EntityProps } from "~/@core/common/entities/entity";
import Card from "./card.entity";

export type ResultProps = EntityProps & {
    cards?: CardProps[];
    player?: PlayerProps;
    hasAttacked?: boolean;
  }

export default class Result extends Entity {
  readonly cards: Card[];
  readonly player: Player;
  readonly hasAttacked: boolean;

  constructor(props: ResultProps){
    super(props);

    if(!props.player){
      throw new ResultError("Player is required.");
    }

    this.hasAttacked = !!(props.hasAttacked);
    this.player = Player.create(props.player)
    this.cards = Array.isArray(props.cards) ? props.cards.map(c => Card.create(c)): [];
  }

  get score() {
    return this.cards.reduce((total, card) => total + card.points, 0);
  }

  get word() {
    return this.cards.map(c => c.value).join("");
  }

  override toString(): string {
    return JSON.stringify(this.toJson(), null, 2);
  }

  override toJson(): ResultProps {
    return {
      ...super.toJson(),
      player: this.player.toJson(),
      hasAttacked: this.hasAttacked,
      cards: this.cards.map(c => c.toJson()),
    };
  }

  static override create(command: ResultProps){
    return new Result(command);
  }
}

export class ResultError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResultError";
  }
}