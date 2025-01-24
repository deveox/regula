import { MongoClient } from 'mongodb'
import { Interface } from '@/Interface/index.js'
import { Transaction } from './Transaction.js'
import mongodb from 'mongodb'
export class Db extends Interface.Db {
  private client?: MongoClient

  get $() {
    if (!this.client) throw new Error('Client is not connected')
    return this.client
  }

  private $db?: mongodb.Db
  collection(name: string) {
    if (!this.$db) this.$db = this.$.db()
    return this.$db.collection(name)
  }

  async $connect(options: Interface.Db.Options) {
    this.client = new MongoClient(options.url)
    await this.$.connect()
  }

  async $disconnect() {
    if (this.isConnected) {
      await this.$.close()
      this.$isConnected = false
    }
  }

  tx() {
    return new Transaction(this)
  }

  override get db() {
    return this
  }
}

export const db = new Db()
