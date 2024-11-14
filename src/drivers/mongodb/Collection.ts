import mongodb from 'mongodb'
import { Document } from './Document.js'
import { Err } from '@/error/Err.js'
import { Driver } from '@/driver/index.js'
import { DB } from './DB.js'
import { Transaction } from './Transaction.js'

export class Collection<D extends Document> extends Driver.Collection<Document, D> {
  $: mongodb.Collection<D>
  constructor(db: DB, col: mongodb.Collection<D>, options: Driver.Collection.Options<D>) {
    super(db, options)
    this.$ = col
  }

  protected async $insert(data: Driver.Model.Creatable<D>, options?: Driver.Collection.OperationOptions): Promise<D> {
    const session = (options?.tx as Transaction | undefined)?.session
    const res = await this.$.insertOne(data as mongodb.OptionalUnlessRequiredId<D>, {
      session,
    })
    const doc = await this.$.findOne(
      { _id: res.insertedId },
      {
        session,
      }
    )
    if (!doc) {
      throw new Err('Failed to insert document')
    }
    return doc as D
  }

  protected async $update(id: string, data: Driver.Model.Updatable<D>, options?: Driver.Collection.OperationOptions): Promise<D> {
    const session = (options?.tx as Transaction | undefined)?.session
    const res = await this.$.updateOne(
      { _id: id } as mongodb.Filter<D>,
      { $set: data },
      {
        session,
      }
    )
    if (res.modifiedCount === 0) {
      throw new Err(`Document ${id} is not found, update failed`, Err.Code.NotFound)
    }
    const doc = await this.$.findOne({ _id: id } as mongodb.Filter<D>, { session })
    if (!doc) {
      throw new Err('Failed to update document')
    }
    return doc as D
  }
}
