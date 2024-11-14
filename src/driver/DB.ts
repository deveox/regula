import { Collection } from './Collection.js'
import { Client } from './Client.js'
import { Model } from './Model.js'
import { Transaction } from './Transaction.js'

export abstract class DB<MBound extends Model> {
  name: string
  client: Client<MBound>
  constructor(name: string, client: Client<MBound>) {
    this.name = name
    this.client = client
  }

  abstract createCollection<M extends MBound>(options: Collection.Options<M>): Collection<MBound, M>
  abstract transaction(): Transaction
}
