import { Changes } from '../Changes.js'
import { Flatten } from '../types/Flatten.js'
import { get } from '../utils/index.js'

export class Model {
  createdAt?: Date
  updatedAt?: Date
  $changes: Changes<this>;
  [x: string]: any

  get $newChanges(): Partial<Flatten<this>> {
    const res: Partial<Flatten<this>> = {}
    for (const path in this.$changes.data) {
      res[path as keyof Flatten<this>] = get(this, path) as any
    }
    return res
  }

  protected constructor() {
    this.$changes = new Changes<this>()
  }
}

export namespace Model {
  export type Creatable<M> = M // todo
  export type Updatable<M> = M // todo
}
