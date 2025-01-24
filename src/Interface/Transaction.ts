import { Db } from './Db.js'

export abstract class Transaction {
  abstract db: Db

  abstract commit(): void
  abstract rollback(): void
  tx(): Transaction {
    return this
  }
}
