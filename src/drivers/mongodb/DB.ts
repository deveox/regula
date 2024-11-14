import { Db } from 'mongodb'
import { Document } from './Document.js'
import { Driver } from '@/driver/index.js'
import { Client } from './Client.js'
import { Collection } from './Collection.js'
import { Transaction } from './Transaction.js'

export class DB extends Driver.DB<Document> {
  $: Db
  override client: Client
  constructor(name: string, client: Client, db: Db) {
    super(name, client)
    this.$ = db
    this.client = client
  }

  createCollection<D extends Document>(options: Driver.Collection.Options<D>): Collection<D> {
    const c = this.$.collection<D>(options.name)
    return new Collection(this, c, options)
  }

  override transaction() {
    return new Transaction(this.client.$)
  }
}
