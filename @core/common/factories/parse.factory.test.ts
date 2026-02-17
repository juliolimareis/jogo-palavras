/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import type { EntityProps } from "~/@core/common/entities/entity";
import Entity from "~/@core/common/entities/entity";
import Parse from "./Parse.factory";

class MockEntity extends Entity {
  override toString(): string {
    return "Method not implemented.";
  }

  name: string;

  constructor(props?: EntityProps & { name?: string }) {
    super(props);
    this.name = props?.name || "";
  }

  override toJson(): any {
    return { id: this.id, name: this.name };
  }

  static override create(props?: EntityProps & { name?: string }): MockEntity {
    return new MockEntity(props);
  }
}

enum TestEnum {
  VALUE_ONE = "one",
  VALUE_TWO = "two",
}

describe("Parse Factory", () => {
  describe("toDate", () => {
    it("deve retornar Date quando passado um objeto Date", () => {
      const date = new Date();

      expect(Parse.toDate(date)).toEqual(date);
    });

    it("deve retornar Date quando passado uma string de data válida", () => {
      const dateStr = "2023-01-01T00:00:00.000Z";

      expect(Parse.toDate(dateStr)).toEqual(new Date(dateStr));
    });

    it("deve retornar Date quando passado um objeto com método toDate() (Firestore Timestamp)", () => {
      const date = new Date();
      const timestamp = { toDate: () => date };

      expect(Parse.toDate(timestamp)).toEqual(date);
    });

    it("deve retornar Date quando passado um objeto com seconds (Unix Timestamp)", () => {
      const seconds = 1672531200; // 2023-01-01
      const date = new Date(seconds * 1000);

      expect(Parse.toDate({ seconds })).toEqual(date);
    });

    it("deve retornar null para entradas inválidas", () => {
      expect(Parse.toDate(null)).toBeNull();
      expect(Parse.toDate(undefined)).toBeNull();
      expect(Parse.toDate("invalid-date")).toBeNull();
      expect(Parse.toDate(123)).toBeNull();
    });
  });

  describe("enumValue", () => {
    it("deve retornar o valor do enum se válido", () => {
      expect(Parse.enumValue(TestEnum, "one")).toBe(TestEnum.VALUE_ONE);
    });

    it("deve retornar null se o valor for inválido", () => {
      expect(Parse.enumValue(TestEnum, "three")).toBeNull();
    });

    it("deve retornar null se o valor for null ou undefined", () => {
      expect(Parse.enumValue(TestEnum, null)).toBeNull();
      expect(Parse.enumValue(TestEnum, undefined)).toBeNull();
    });
  });

  describe("string", () => {
    it("deve retornar string se a entrada for string", () => {
      expect(Parse.string("test")).toBe("test");
    });

    it("deve retornar null se a entrada não for string", () => {
      expect(Parse.string(123)).toBeNull();
      expect(Parse.string(null)).toBeNull();
    });
  });

  describe("stringEmpty", () => {
    it("deve retornar string se a entrada for string", () => {
      expect(Parse.stringEmpty("test")).toBe("test");
    });

    it("deve retornar string vazia se a entrada não for string", () => {
      expect(Parse.stringEmpty(123)).toBe("");
      expect(Parse.stringEmpty(null)).toBe("");
    });
  });

  describe("number", () => {
    it("deve retornar number se a entrada for number", () => {
      expect(Parse.number(123)).toBe(123);
    });

    it("deve retornar null se a entrada não for number", () => {
      expect(Parse.number("123")).toBeNull();
      expect(Parse.number(null)).toBeNull();
    });
  });

  describe("boolean", () => {
    it("deve retornar a representação booleana", () => {
      expect(Parse.boolean(true)).toBe(true);
      expect(Parse.boolean("true")).toBe(true);
      expect(Parse.boolean(1)).toBe(true);
      expect(Parse.boolean(false)).toBe(false);
      expect(Parse.boolean(null)).toBe(false);
      expect(Parse.boolean(undefined)).toBe(false);
      expect(Parse.boolean(0)).toBe(false);
    });
  });

  describe("date", () => {
    it("deve retornar Date se válido", () => {
      const date = new Date();

      expect(Parse.date(date)).toBe(date);
    });

    it("deve retornar null se Date for inválido", () => {
      expect(Parse.date(new Date("invalid"))).toBeNull();
    });

    it("deve retornar null se não for uma instância de Date", () => {
      expect(Parse.date("2023-01-01")).toBeNull();
    });
  });

  describe("array", () => {
    it("deve retornar array se a entrada for array", () => {
      expect(Parse.array([1, 2])).toEqual([1, 2]);
    });

    it("deve retornar null se a entrada não for array", () => {
      expect(Parse.array("test")).toBeNull();
    });
  });

  describe("object", () => {
    it("deve retornar objeto se a entrada for objeto com chaves", () => {
      const obj = { key: "value" };

      expect(Parse.object(obj)).toBe(obj);
    });

    it("deve retornar null se o objeto estiver vazio", () => {
      expect(Parse.object({})).toBeNull();
    });

    it("deve retornar null se a entrada não for objeto", () => {
      expect(Parse.object(null)).toBeNull();
      expect(Parse.object("test")).toBeNull();
    });
  });

  describe("isObject", () => {
    it("deve retornar true para objeto não vazio", () => {
      expect(Parse.isObject({ a: 1 })).toBe(true);
    });

    it("deve retornar false para objeto vazio", () => {
      expect(Parse.isObject({})).toBe(false);
    });
  });

  describe("isEmptyObject", () => {
    it("deve retornar true para objeto vazio", () => {
      expect(Parse.isEmptyObject({})).toBe(true);
    });

    it("deve retornar false para objeto não vazio", () => {
      expect(Parse.isEmptyObject({ a: 1 })).toBe(false);
    });

    it("deve retornar false para não-objeto", () => {
      expect(Parse.isEmptyObject(null)).toBe(false);
    });
  });

  describe("isObjectKeyValueString", () => {
    it("deve retornar true se todos os valores forem strings", () => {
      expect(Parse.isObjectKeyValueString({ a: "1", b: "2" })).toBe(true);
    });

    it("deve retornar false se algum valor não for string", () => {
      expect(Parse.isObjectKeyValueString({ a: "1", b: 2 })).toBe(false);
    });
  });

  describe("isObjectKeyValueBoolean", () => {
    it("deve retornar true se todos os valores forem booleanos", () => {
      expect(Parse.isObjectKeyValueBoolean({ a: true, b: false })).toBe(true);
    });

    it("deve retornar false se algum valor não for booleano", () => {
      expect(Parse.isObjectKeyValueBoolean({ a: true, b: "false" })).toBe(false);
    });
  });

  describe("objectKeyValueBoolean", () => {
    it("deve retornar objeto se todos os valores forem booleanos", () => {
      const obj = { a: true, b: false };

      expect(Parse.objectKeyValueBoolean(obj)).toBe(obj);
    });

    it("deve retornar null se algum valor não for booleano", () => {
      expect(Parse.objectKeyValueBoolean({ a: true, b: 1 })).toBeNull();
    });
  });

  describe("Arrays Tipados", () => {
    it("stringArray deve retornar array de strings se todos forem strings", () => {
      expect(Parse.stringArray(["a", "b"])).toEqual(["a", "b"]);
    });

    it("stringArray deve retornar array vazio se houver mistura de tipos", () => {
      expect(Parse.stringArray(["a", 1])).toEqual([]);
    });

    it("numberArray deve retornar array de números", () => {
      expect(Parse.numberArray([1, 2])).toEqual([1, 2]);
      expect(Parse.numberArray([1, "2"])).toEqual([]);
    });

    it("booleanArray deve retornar array de booleanos", () => {
      expect(Parse.booleanArray([true, false])).toEqual([true, false]);
      expect(Parse.booleanArray([true, "false"])).toEqual([]);
    });

    it("dateArray deve retornar array de Dates", () => {
      const d1 = new Date();

      expect(Parse.dateArray([d1])).toEqual([d1]);
      expect(Parse.dateArray([d1, "string"])).toEqual([]);
    });

    it("objectArray deve retornar array de objetos", () => {
      const o1 = { a: 1 };

      expect(Parse.objectArray([o1])).toEqual([o1]);
      expect(Parse.objectArray([o1, null])).toEqual([]);
    });
  });

  describe("Métodos de Entidade", () => {
    it("entityArray deve criar entidades a partir de props", () => {
      const props = [{ name: "test1" }, { name: "test2" }];
      const entities = Parse.entityArray(MockEntity, props);

      expect(entities).toHaveLength(2);
      expect(entities[0]).toBeInstanceOf(MockEntity);
      expect(entities[0]?.name).toBe("test1");
    });

    it("entityArray deve retornar array vazio se entrada não for array", () => {
      expect(Parse.entityArray(MockEntity, null as any)).toEqual([]);
    });

    it("createEntity deve criar entidade a partir de props", () => {
      const entity = Parse.createEntity(MockEntity, { name: "test" });

      expect(entity).toBeInstanceOf(MockEntity);
      expect(entity?.name).toBe("test");
    });

    it("createEntity deve retornar null se props for null", () => {
      expect(Parse.createEntity(MockEntity, null as any)).toBeNull();
    });
  });
});
