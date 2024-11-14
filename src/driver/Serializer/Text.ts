import { Base } from './Base.js'

export abstract class Text<DBSerialized> extends Base<string, string, DBSerialized> {
  toJSON(value: string): string {
    return value
  }
  fromJSON(value: string): string {
    return value
  }
}
