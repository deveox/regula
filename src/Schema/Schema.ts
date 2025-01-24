import { Field } from "./Field.js"

export class Schema<V extends Record<string, Field<any, any, any>> {
  constructor(fields) {}

  fromJSON(value: unknown): V {
    return value as V
  }
  toJSON(value: V): unknown {
    return value
  }
  fromDB(value: unknown): V {
    return value as V
  }
  toDB(value: V): unknown {
    return value
  }
}
