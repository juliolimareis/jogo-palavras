/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { EntityProps, ID } from "~/@core/common/entities/entity";

 

export default abstract class DatabaseAdapterI<T extends EntityProps> {
  readonly collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  abstract insert(object: T, id?: ID): Promise<T>;

  abstract find(options?: DatabaseDriverOptions): Promise<T[]>;

  abstract findByIds(ids: ID[], options?: DatabaseDriverOptions): Promise<T[]>;

  abstract findById(id: ID, options?: DatabaseDriverOptions): Promise<T | null>;

  abstract update(id: ID, object: T): Promise<void>;

  abstract delete(id: ID): Promise<void>;

  abstract commit(): Promise<void>;

  abstract rollback(): Promise<void>;

  abstract healthCheck: () => Promise<void>;
}

 
export interface DatabaseDriverOptions {}
