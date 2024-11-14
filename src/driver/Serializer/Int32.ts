import { Base } from './Base.js'

export abstract class Int32<DBSerialized> extends Base<number, number, DBSerialized> {
  toJSON(value: number): number {
    return value
  }
  fromJSON(value: number): number {
    return value
  }
}
