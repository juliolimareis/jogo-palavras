import Entity, { type EntityProps } from "../../common/entities/entity";

export type CardProps = EntityProps & {
  value: string;
  points?: number;
  image?: string;
  isShield?: boolean;
  isSelected?: boolean;
  jokerValue?: string;
  isJoker?: boolean;
  accentuation?: string;
  variations?: CardProps[];
  finalValue?: string;
  variationPosition?: number | null;
}

export default class Card extends Entity {
  readonly points: number;
  readonly image: string;
  readonly isShield: boolean;
  readonly isSelected: boolean;
  readonly jokerValue: string;
  readonly isJoker: boolean;
  readonly accentuation: string;
  readonly variations: Card[];
  readonly finalValue: string;
  
  private _value: string;
  private _variationPosition: number | null;

  constructor(props: CardProps){
    super(props);

    if(!props.value){
      throw new Error("Card value is required.");
    }

    this._value = props.value;
    this.image = props.image ?? "";
    this.points = props.points ?? 0;
    this.isJoker = props.isJoker ?? false;
    this.isShield = props.isShield ?? false;
    this.jokerValue = props.jokerValue ?? "";
    this.finalValue = props.finalValue ?? "";
    this.isSelected = props.isSelected ?? false;
    this.accentuation = props.accentuation ?? "";
    this.variations = Array.isArray(props.variations) ? props.variations.map(c => Card.create(c)): [];

    if(this.variations.length &&
      props.variationPosition &&
      !isNaN(Number(props.variationPosition)) &&
      this.variations[props.variationPosition]
    ){
      this._variationPosition = props.variationPosition;
      this._value = this.variations?.[props.variationPosition]?.value as string;
    }else{
      this._variationPosition = null;
    }
  }

  override toJson(): CardProps {
    return {
      ...super.toJson(),
      image: this.image,
      value: this._value,
      points: this.points,
      isJoker: this.isJoker,
      isShield: this.isShield,
      jokerValue: this.jokerValue,
      finalValue: this.finalValue,
      isSelected: this.isSelected,
      accentuation: this.accentuation,
      variations: this.variations.map(c => c.toJson()),
    };
  }

  get value(): string {
    return this._value;
  }

  get variationPosition(): number | null {
    return this._variationPosition;
  }

  set variationPosition(value: number | null) {
    this._variationPosition = value;
  }

  override toString(){
    return JSON.stringify(this.toJson(), null, 2);
  }

  static override create(command: CardProps){
    return new Card(command);
  }
}