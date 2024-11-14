import { Driver } from '@/driver/index.js'
import { Base } from './Base.js'

export class Bool extends Base {
  type: Driver.Type.Bool<unknown>
  constructor(config: Bool.Config) {
    super(config)
  }
}

export namespace Bool {
  export interface Config extends Base.Config {}
}
