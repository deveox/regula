import { Serializer } from '../Serializer.js'
import { Type } from './Type.js'

export abstract class Int64<DBSerialized> extends Type<bigint, Int64.Json, DBSerialized> {
  json = new Serializer<bigint, Int64.Json>({
    serialize(value) {
      return {
        $int64: value.toString(),
      }
    },
    deserialize(value) {
      return BigInt(value.$int64)
    },
  })
}

export namespace Int64 {
  export type Json = {
    $int64: string
  }
}
