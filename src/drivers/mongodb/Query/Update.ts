import { Interface } from '@/Interface/index.js'
import { Model } from '@/Interface/Model.js'
import { db, Db } from '../Db.js'
import { Transaction } from '../Transaction.js'
import mongodb from 'mongodb'

export class Update<M extends Model> extends Interface.Query.Update<M> {
  singleton = db
  async $one(conn: Db | Transaction, model: M): Promise<void> {
    const db = conn.db
    await db.collection(this.collection.name).updateOne(
      {
        _id: new mongodb.ObjectId(model._id),
      },
      { $set: model.$newChanges },
      {
        session: conn instanceof Transaction ? conn.session : undefined,
      }
    )
  }
  async $many(conn: Db | Transaction, models: M[]): Promise<void> {
    const db = conn.db
    const res = await db.collection(this.collection.name).bulkWrite(
      models.map(m => {
        return {
          updateOne: {
            filter: { _id: new mongodb.ObjectId(m._id) },
            update: { $set: m.$newChanges },
          },
        }
      }),
      { session: conn instanceof Transaction ? conn.session : undefined }
    )
    if (res.hasWriteErrors()) {
      throw new Error('Update.$many failed, check cause for details', { cause: res.getWriteErrors() })
    }
  }
}
