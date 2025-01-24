import { Driver } from '@/Interface/index.js'
import { Long } from 'mongodb'

export class Int64 extends Driver.Type.Int64<Long> {
  to(value: bigint): Long {
    return Long.fromBigInt(value)
  }
  from(value: Long): bigint {
    return value.toBigInt()
  }
}
