/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type Entity from "~/@core/common/entities/entity";
import type { EntityProps } from "~/@core/common/entities/entity";

export default class Parse {
  static toDate(value: any): Date | null {
    let date = null;

    if (value instanceof Date){
      date = value;
    }else if (typeof value === "string"){
      date = new Date(value);
    }else if (value?.toDate){
      date = value.toDate();
    }else if (value?.seconds){
      date = new Date(value.seconds * 1000);
    }

    return Parse.date(date);
  }

  static enumValue<T extends Record<string, string | number>>(
    enumType: T,
    value?: string | null
  ): T[keyof T] | null {
    if (value == null) return null;

    const enumValues = Object.values(enumType).map(String);

    return enumValues.includes(value)
      ? (value as T[keyof T])
      : null;
  }

  static string(value: unknown): string | null {
    if(typeof value === "string"){
      return value;
    }

    return null;
  }

  static stringEmpty(value: unknown): string {
    if(typeof value === "string"){
      return value;
    }

    return "";
  }

  static number(value: unknown): number | null {
    if(typeof value === "number"){
      return value;
    }

    return null;
  }

  static boolean(value: unknown): boolean {
    return !!(value);
  }

  static date(value: unknown): Date | null {
    if(value instanceof Date && value.getTime()){
      return value;
    }

    return null;
  }

  static array<T = unknown>(value: T): unknown[] | null {
    if(Array.isArray(value)){
      return value;
    }

    return null;
  }

  static object(value: unknown): Record<string, unknown> | null {
    if(value && typeof value === "object" && Object.keys(value).length){
      return value as Record<string, unknown>;
    }

    return null;
  }

  static isObject(value: unknown): boolean {
    return !!(Parse.object(value));
  }

  static isEmptyObject(value: unknown): boolean {
    return !!(value && typeof value === "object" && !Object.keys(value).length);
  }

  static isObjectKeyValueString(value: unknown): value is Record<string, unknown> {
    const object = Parse.object(value);

    if(object && Object.values(object).every(value => typeof value === "string")){
      return true;
    }

    return false;
  }

  static isObjectKeyValueBoolean(value: unknown): boolean {
    const object = Parse.object(value);

    if(object && Object.values(object).every(value => typeof value === "boolean")){
      return true;
    }

    return false;
  }

  static objectKeyValueBoolean(value: unknown): Record<string, boolean> | null {
    const object = Parse.object(value);

    if(object && Object.values(object).every(value => typeof value === "boolean")){
      return object as Record<string, boolean>;
    }

    return null;
  }

  static stringArray(value: unknown): string[] {
    if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
      return value as string[];
    }

    return [];
  }

  static numberArray(value: unknown): number[] {
    if (Array.isArray(value) && value.every((item) => typeof item === "number")) {
      return value as number[];
    }

    return [];
  }

  static booleanArray(value: unknown): boolean[] {
    if (Array.isArray(value) && value.every((item) => typeof item === "boolean")) {
      return value as boolean[];
    }

    return [];
  }

  static dateArray(value: unknown): Date[] {
    if (Array.isArray(value) && value.every((item) => item instanceof Date)) {
      return value as Date[];
    }

    return [];
  }

  static objectArray(value: unknown): Record<string, unknown>[] {
    if (Array.isArray(value) && value.every((item) => typeof item === "object" && item !== null)) {
      return value as Record<string, unknown>[];
    }

    return [];
  }

  static entityArray<T extends Entity>(
    entityClass: { create(props?: EntityProps): T } & typeof Entity,
    values?: Array<any>
  ): T[] {
    if (Array.isArray(values)) {
      return values.map((props) => entityClass.create(props));
    }

    return [];
  }

  static createEntity<T extends Entity>(
    entityClass: { create(props?: EntityProps): T } & typeof Entity,
    props?: any
  ): T | null {
    if (props) {
      return entityClass.create(props);
    }

    return null;
  }
}