 
/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  Firestore,
  CollectionReference,
  QueryConstraint} from "firebase/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  documentId,
  writeBatch,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";


import type { DatabaseDriverOptions } from "./database.adapter.interface";
import type { EntityProps } from "~/@core/common/entities/entity";
import type DatabaseAdapterI from "./database.adapter.interface";

export type FilterCondition = {
  field: string;
  operator:
    | "<"
    | "<="
    | "=="
    | "!="
    | ">="
    | ">"
    | "array-contains"
    | "array-contains-any"
    | "in"
    | "not-in";
  value: any;
};

export type OrderByCondition = {
  field: string;
  direction?: "asc" | "desc";
};

export type FindOptions = DatabaseDriverOptions & {
  where?: FilterCondition[];
  orderBy?: OrderByCondition[];
  limit?: number;
};

export default class FirestoreDriver<T extends EntityProps>
  implements DatabaseAdapterI<T>
{
  private batch;
  private _pendingOperations = 0;

  ref: CollectionReference;

  constructor(
    private readonly db: Firestore,
    readonly collectionName: string
  ) {
    this.ref = collection(this.db, collectionName);
    this.batch = writeBatch(this.db)
  }

  get pendingOperations() {
    return this._pendingOperations;
  }

  async find(options?: FindOptions): Promise<T[]> {
    const constraints: QueryConstraint[] = [];

    if (options?.where?.length) {
      options.where.forEach((condition) => {
        constraints.push(
          where(condition.field, condition.operator, condition.value)
        );
      });
    }

    if (options?.orderBy?.length) {
      options.orderBy.forEach((order) => {
        constraints.push(orderBy(order.field, order.direction));
      });
    }

    if (options?.limit !== undefined) {
      constraints.push(limit(options.limit));
    }

    const q = query(this.ref, ...constraints);
    const snap = await getDocs(q);

    return snap.docs.map(
      (docSnap) => ({ ...docSnap.data(), id: docSnap.id } as T)
    );
  }

  async findById(id: string): Promise<T | null> {
    const docRef = doc(this.ref, id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return { ...snap.data(), id: snap.id } as T;
    }

    return null;
  }

  async insert(object: T, id?: string): Promise<T> {
    const data: any = {
      ...object,
      createdAt: serverTimestamp(),
    };

    if ("id" in data) {
      delete data.id;
    }

    let currentId: string;

    if (id) {
      const docRef = doc(this.ref, id);
      this.batch.set(docRef, data);
      currentId = id;
    } else {
      const docRef = doc(this.ref);
      this.batch.set(docRef, data);
      currentId = docRef.id;
    }

    this.addPendingOperations();

    return { ...object, id: currentId } as T;
  }

  async update(id: string, object: Partial<T>): Promise<void> {
    const docRef = doc(this.ref, id);

    const data: any = {
      ...object,
      updatedAt: serverTimestamp(),
    };

    if (data.id) {
      delete data.id;
    }

    this.batch.update(docRef, data);
    this.addPendingOperations();
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.ref, id);

    this.batch.delete(docRef);
    this.addPendingOperations();
  }

  async findByIds(ids: string[]): Promise<T[]> {
    if (!ids.length) return [];

    const chunkSize = 10;
    const chunks: string[][] = [];

    for (let i = 0; i < ids.length; i += chunkSize) {
      chunks.push(ids.slice(i, i + chunkSize));
    }

    const results = await Promise.all(
      chunks.map((chunk) =>
        getDocs(query(this.ref, where(documentId(), "in", chunk)))
      )
    );

    return results
      .flatMap((snap) => snap.docs)
      .map((docSnap) => ({ ...docSnap.data(), id: docSnap.id } as T));
  }

  buildOnSnapshot(
    callback: (data: T[]) => void,
    options?: FindOptions
  ): () => void {
    const constraints: QueryConstraint[] = [];

    if (options?.where?.length) {
      options.where.forEach((condition) => {
        constraints.push(
          where(condition.field, condition.operator, condition.value)
        );
      });
    }

    if (options?.orderBy?.length) {
      options.orderBy.forEach((order) => {
        constraints.push(orderBy(order.field, order.direction));
      });
    }

    if (options?.limit !== undefined) {
      constraints.push(limit(options.limit));
    }

    const q = query(this.ref, ...constraints);

    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(
        (docSnap) => ({ ...docSnap.data(), id: docSnap.id } as T)
      );
      callback(data);
    });
  }

  async commit(): Promise<void> {
    if (this.pendingOperations) {
      await this.batch.commit();
      this.batch = writeBatch(this.db);
      this.clearPendingOperations();
    }
  }

  async rollback(): Promise<void> {
    this.batch = writeBatch(this.db);
    this.clearPendingOperations();
  }

  private addPendingOperations(): void {
    if (this._pendingOperations >= 500) {
      throw new FirebaseDriverError(
        "Firestore allows a maximum of 500 operations per batch."
      );
    }

    this._pendingOperations++;
  }

  private clearPendingOperations() {
    this._pendingOperations = 0;
  }

  async healthCheck(): Promise<void> {
    // Client SDK não tem listCollections().
    // Apenas tentamos uma leitura simples.
    await getDocs(query(this.ref, limit(1)));
  }
}

export class FirebaseDriverError extends Error {
  constructor(message: string) {
    super(`[FirestoreDriver] ${message}`);
    this.name = "FirebaseDriverError";
  }
}
