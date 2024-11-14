import { MongoClient } from 'mongodb'
import { DB } from './DB.js'
import { Driver } from '@/driver/index.js'
import { Document } from './Document.js'

export class Client extends Driver.Client<Document> {
  $: MongoClient
  constructor(options: Driver.Client.Options) {
    super(options)
    this.$ = new MongoClient(options.url)
  }

  db(name: string) {
    const db = this.$.db(name)
    return new DB(name, this, db)
  }
}
