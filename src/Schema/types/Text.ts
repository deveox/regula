import { Type } from './Type.js'

export abstract class Text<DBSerialized> extends Type<string, string, DBSerialized> {
  json = undefined
}
