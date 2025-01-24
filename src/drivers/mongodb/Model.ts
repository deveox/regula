import { Interface } from '@/Interface/index.js'

export class Model extends Interface.Model {
  declare _id: string
}

export namespace Model {
  export type Creatable<M> = Interface.Model.Creatable<M>
}
