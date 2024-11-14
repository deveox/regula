import { Driver } from '@/driver/index.js'

export class Int32 extends Driver.Type.Int32<number> {
  to(value: number): number {
    return value
  }

  from(value: number): number {
    return value
  }
}
