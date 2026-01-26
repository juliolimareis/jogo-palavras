import Entity, { type EntityProps } from "~/@core/common/entities/entity";
import type { DeckType } from "./deck.entity";
import type Player from "./player.entity";
import type Result from "./result.entity";
import type Deck from "./deck.entity";
import type Card from "./card.entity";

const MAX_TABLE_CARDS = 4;

export type GameAggregateRootProps = EntityProps & {
  playerAdmin: Player;
  maxPlayers: number;
  maxRounds: number;
  roundTimeout: number;
  type: DeckType;
  round: number;
  results: Result[];
  players: Player[];
  deck: Deck;
  tableCards: Card[];
  gameReady?: boolean;
  endGame?: boolean;
  jumpRound?: boolean;
}

export default class GameAggregateRoot extends Entity {
  readonly playerAdmin: Player;
  readonly maxPlayers: number;
  readonly maxRounds: number;
  readonly roundTimeout: number;
  readonly type: DeckType;
  readonly round: number;
  readonly results: Result[];
  readonly players: Player[];
  readonly deck: Deck;
  readonly tableCards: Card[];
  readonly gameReady: boolean;
  readonly endGame: boolean;
  readonly jumpRound: boolean;

  constructor(props: GameAggregateRootProps){
    super(props);

    this.playerAdmin = props.playerAdmin;
    this.maxPlayers = props.maxPlayers;
    this.maxRounds = props.maxRounds;
    this.roundTimeout = props.roundTimeout;
    this.type = props.type;
    this.round = props.round;
    this.results = props.results;
    this.players = props.players;
    this.deck = props.deck;
    this.tableCards = props.tableCards;
    this.gameReady = !!(props.gameReady);
    this.endGame = !!(props.endGame);
    this.jumpRound = !!(props.jumpRound);
  }

  private drawTableCards(){
    for (let i = 0; i < MAX_TABLE_CARDS; i++) {
      this.tableCards.push(this.deck.draw())
    }

    return { table: this.tableCards, deck: this.deck };
  }
  
  override toString(): string {
    throw new Error("Method not implemented.");
  }
  
}