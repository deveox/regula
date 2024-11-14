import { Driver } from '@/driver/index.js'
import { ClientSession, MongoClient } from 'mongodb'

export class Transaction extends Driver.Transaction {
  session: ClientSession
  constructor(client: MongoClient) {
    super()
    this.session = client.startSession()
    this.session.startTransaction()
  }

  async commit() {
    await this.session.commitTransaction()
  }

  async rollback() {
    await this.session.abortTransaction()
  }
}
