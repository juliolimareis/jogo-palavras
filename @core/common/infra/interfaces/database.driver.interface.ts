/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { EntityProps, EntityId } from "~/@core/common/entities/entity";

export default abstract class DatabaseDriverI<T extends EntityProps> {
  readonly collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  abstract insert(object: T, id?: EntityId): Promise<T>;

  abstract find(options?: DatabaseDriverOptions): Promise<T[]>;

  abstract findByIds(ids: EntityId[], options?: DatabaseDriverOptions): Promise<T[]>;

  abstract findById(id: EntityId, options?: DatabaseDriverOptions): Promise<T | null>;

  abstract update(id: EntityId, object: T): Promise<void>;

  abstract delete(id: EntityId): Promise<void>;

  abstract commit(): Promise<void>;

  abstract rollback(): Promise<void>;

  abstract healthCheck: () => Promise<void>;
}
 
export interface DatabaseDriverOptions {}
