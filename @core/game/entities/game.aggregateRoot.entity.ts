import Entity, { type EntityProps } from "~/@core/common/entities/entity";
import { DeckType, type DeckProps } from "./deck.entity";
import Player from "./player.entity";
import Result from "./result.entity";
import Deck from "./deck.entity";
import Card from "./card.entity";
import CardFactory from "../factories/card.factory";
import type { ResultProps } from "./result.entity";
import type { PlayerProps } from "./player.entity";
import type { CardProps } from "./card.entity";

const MAX_TABLE_CARDS = 4;
const TIME_TO_NEXT_ROUND = 12; 

export enum GameStatus {
  PREPARATION,
  GAMING,
  RESULT,
  FINISHED
}

export type GameAggregateRootProps = EntityProps & {
  playerAdmin: PlayerProps;
  maxPlayers: number;
  maxRounds: number;
  roundTimeout: number;
  type: DeckType;
  round: number;
  results: ResultProps[];
  players: PlayerProps[];
  deck: DeckProps;
  tableCards?: CardProps[];
  status?: GameStatus;
  jumpRound?: boolean;
  timeNextRound?: number;
}

export default class GameAggregateRoot extends Entity {
  private playerAdmin: Player;
  private maxPlayers: number;
  private maxRounds: number;
  private roundTimeout: number;
  private type: DeckType;
  private round: number;
  private results: Result[];
  private players: Player[];
  private deck: Deck;
  private tableCards: Card[];
  private status?: GameStatus;
  private jumpRound: boolean;
  private timeNextRound: number;

  constructor(props: GameAggregateRootProps){
    super(props);

    this.playerAdmin = Player.create(props.playerAdmin);
    this.maxPlayers = props.maxPlayers;
    this.maxRounds = props.maxRounds;
    this.roundTimeout = props.roundTimeout;
    this.type = props.type;
    this.round = props.round;
    this.results = props.results.map(r => Result.create(r));
    this.players = props.players.map(p => Player.create(p));
    this.deck = Deck.create(props.deck);
    this.tableCards = props?.tableCards?.map(c => Card.create(c)) ?? [];
    this.status = props.status ?? GameStatus.PREPARATION;
    this.jumpRound = !!(props.jumpRound);
    this.timeNextRound = props.timeNextRound ?? TIME_TO_NEXT_ROUND;
  }

  startGame(){
    if(this.status === GameStatus.GAMING || this.status === GameStatus.RESULT){
      return;
    }

    this.status = GameStatus.GAMING;
    this.jumpRound = false;

    this.deck = this.type === DeckType.JP ? this.buildDeckJP() : this.buildDeckPT();
    
    this.players.forEach((player) => {
      player.addCard(...this.drawCard(7));
      player.addCard(this.generateRandomShield());
    });

    this.tableCards = this.drawCard(MAX_TABLE_CARDS);
  }

  private generateRandomShield(){
    const cardsLatters = this.type === DeckType.JP ? CardFactory.buildJaponeseLetters() : CardFactory.buildLetters();
    const randomCard = cardsLatters[Math.floor(Math.random() * cardsLatters.length)] as Card;
    
    const shieldCard = Card.create({
      ...randomCard.toJson(),
      isShield: true,
      points: 10
    });

    return shieldCard;
  }

  private buildDeckPT(){
    let config = { atk: 14, consonants: 3, joker: 13, vowels: 7 };

    if(this.maxPlayers > 4 && this.maxPlayers <= 6){
      config = { atk: 19, consonants: 4, joker: 18, vowels: 9 };
    } else if(this.maxPlayers > 6 && this.maxPlayers <= 8){
      config = { atk: 23, consonants: 5, joker: 22, vowels: 10 };
    } else if(this.maxPlayers === 8){
      config = { atk: 27, consonants: 6, joker: 26, vowels: 13 };
    }

    return CardFactory.createDeck(
      config.vowels,
      config.consonants,
      config.joker,
      config.atk,
      this.type
    );
  }

  private buildDeckJP(){
    const letters = (this.maxPlayers * 12) + 1;
    const config = { atk: 14, consonants: letters, joker: 13, vowels: letters };
  
    if(this.maxPlayers > 4 && this.maxPlayers <= 6){
      config.atk = 19;
      config.joker = 18;
    } else if(this.maxPlayers > 6 && this.maxPlayers <= 8){
      config.atk = 23;
      config.joker = 22;
    } else{
      config.atk = 27;
      config.joker = 26;
    }
  
    return CardFactory.createDeck(
      config.vowels,
      config.consonants,
      config.joker,
      config.atk,
      this.type
    );
  }

  private drawCard(size = 1){
    const cards = [] as Card[]; 
    
    for (let i = 0; i < size; i++) {
      const drawCard = this.deck.draw();

      if(!drawCard) break;

      cards.push(drawCard);
    }

    return cards;
  }

  override toJson(): GameAggregateRootProps {
    return {
      ...super.toJson(),
      playerAdmin: this.playerAdmin.toJson(),
      maxPlayers: this.maxPlayers,
      maxRounds: this.maxRounds,
      roundTimeout: this.roundTimeout,
      type: this.type,
      round: this.round,
      results: this.results.map(r => r.toJson()),
      players: this.players.map(p => p.toJson()),
      deck: this.deck.toJson(),
      tableCards: this.tableCards.map(c => c.toJson()),
      status: this.status,
      jumpRound: this.jumpRound,
      timeNextRound: this.timeNextRound,
    };
  }

  override toString(): string {
    return JSON.stringify(this.toJson(), null, 2);
  }
  
}