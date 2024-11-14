import { Base } from './Base.js'

export abstract class Int64<DBSerialized> extends Base<bigint, Int64.JSON, DBSerialized> {
  toJSON(value: bigint): Int64.JSON {
    return {
      $int64: value.toString(),
    }
  }
  fromJSON(value: Int64.JSON): bigint {
    return BigInt(value.$int64)
  }
}

export namespace Int64 {
  export type JSON = {
    $int64: string
  }
}
