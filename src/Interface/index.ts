import { Model } from '@/Interface/Model.js'
import { Query } from './Query/index.js'
import { Db } from './Db.js'
import { Transaction } from './Transaction.js'

export * from './Db.js'
export * from './Transaction.js'
export * from './Model.js'
export { Query } from './Query/index.js'

export type Connection = Db | Transaction
export abstract class Driver {
  abstract select: new <M extends Model, PK extends keyof M>(
    ...args: ConstructorParameters<typeof Query.Select<M, PK>>
  ) => Query.Select<M, PK>
  abstract create: new <M extends Model, PK extends keyof M>(
    ...args: ConstructorParameters<typeof Query.Create<M, PK>>
  ) => Query.Create<M, PK>
  abstract update: new <M extends Model, PK extends keyof M>(
    ...args: ConstructorParameters<typeof Query.Update<M, PK>>
  ) => Query.Update<M, PK>
  abstract delete: new <M extends Model, PK extends keyof M>(
    ...args: ConstructorParameters<typeof Query.Delete<M, PK>>
  ) => Query.Delete<M, PK>
}

export * as Interface from './index.js'
