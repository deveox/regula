import { Interface } from '@/Interface/index.js'
import { ClientSession } from 'mongodb'
import { Db } from './Db.js'

export class Transaction extends Interface.Transaction {
  session: ClientSession
  db: Db
  constructor(db: Db) {
    super()
    this.db = db
    this.session = db.$.startSession()
    this.session.startTransaction()
  }

  async commit() {
    await this.session.commitTransaction()
    await this.session.endSession()
  }

  async rollback() {
    await this.session.abortTransaction()
    await this.session.endSession()
  }
}
