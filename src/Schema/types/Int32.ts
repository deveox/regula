import { Type } from './Type.js'

export abstract class Int32<DBSerialized> extends Type<number, number, DBSerialized> {
  json = undefined
}
