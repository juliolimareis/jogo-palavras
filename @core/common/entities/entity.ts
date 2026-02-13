/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Parse from "~/@core/game/factories/Parse.factory";

export type EntityId = string;

export type EntityProps = {
  id?: EntityId | null;
  updatedAt?: Date | null | string | any;
  createdAt?: Date | null | string | any;
}

export default abstract class Entity {
  readonly id: string;

  readonly createdAt: Date;

  private _updatedAt: Date;

  constructor(props?: EntityProps) {
    this.id = Parse.stringEmpty(props?.id);
    this.createdAt = Parse.toDate(props?.createdAt) ?? new Date();
    this._updatedAt = Parse.toDate(props?.updatedAt) ?? this.createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  touch(): void {
    this._updatedAt = new Date();
  }

  toJson(): EntityProps {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  };

  static create(props?: EntityProps): any {
    throw new EntityError("Method not implemented.");
  }
}

export class EntityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EntityError";
  }
}

