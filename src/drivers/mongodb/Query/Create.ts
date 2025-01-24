import { Interface } from '@/Interface/index.js'
import { db, Db } from '../Db.js'
import { Transaction } from '../Transaction.js'
import mongodb from 'mongodb'
import { Model } from '../Model.js'

export class Create<M extends Model> extends Interface.Query.Create<M, '_id'> {
  singleton = db
  async $one(conn: Db | Transaction, data: Model.Creatable<M>): Promise<M> {
    const db = conn.db
    const res = await db.collection(this.collection.name).insertOne(data as unknown as mongodb.OptionalId<mongodb.Document>, {
      session: conn instanceof Transaction ? conn.session : undefined,
    })
    const model = await this.collection.findById(res.insertedId.toString())
    if (!model) throw new Error('Model not found after creation')
    return model
  }
  async $many(conn: Db | Transaction, data: Model.Creatable<M>[]): Promise<M[]> {
    const db = conn.db
    const res = await db
      .collection(this.collection.name)
      .insertMany(data as any, { session: conn instanceof Transaction ? conn.session : undefined })
    const ids = Object.values(res.insertedIds).map(id => id.toString())
    let models: M[]
    try {
      models = await this.collection.select().in('_id', ids).many()
    } catch (e) {
      throw new Error('Model not found after creation', { cause: e })
    }
    if (models.length !== ids.length)
      throw new Error(`Invalid amount of models found after creation, expected: ${ids.length}, found: ${models.length}`)
    return models
  }
}
