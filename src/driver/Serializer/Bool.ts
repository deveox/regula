import { Base } from './Base.js'

export abstract class Bool<DBSerialized> extends Base<boolean, boolean, DBSerialized> {
  toJSON(value: boolean): boolean {
    return value
  }
  fromJSON(value: boolean): boolean {
    return value
  }
}
