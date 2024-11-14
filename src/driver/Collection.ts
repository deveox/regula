import { DB } from './DB.js'
import { Model } from './Model.js'
import { Transaction } from './Transaction.js'

export abstract class Collection<MBound extends Model, M extends MBound> {
  db: DB<MBound>
  name: string
  beforeInsert?: Collection.Options<M>['beforeInsert']
  afterInsert?: Collection.Options<M>['afterInsert']

  beforeUpdate?: Collection.Options<M>['beforeUpdate']
  afterUpdate?: Collection.Options<M>['afterUpdate']

  constructor(db: DB<MBound>, options: Collection.Options<M>) {
    this.db = db
    this.name = options.name
    this.beforeInsert = options.beforeInsert
    this.afterInsert = options.afterInsert

    this.beforeUpdate = options.beforeUpdate
    this.afterUpdate = options.afterUpdate
  }

  protected abstract $insert(data: Model.Creatable<M>, options?: Collection.OperationOptions): Promise<M>
  insert(data: Model.Creatable<M>, options?: Collection.OperationOptions): Promise<M> {
    if (this.beforeInsert || this.afterInsert) {
      return this.runTx(async tx => {
        const $data = this.beforeInsert ? await this.beforeInsert(tx, data) : data
        const res = await this.$insert($data, { tx })
        if (this.afterInsert) {
          return this.afterInsert(tx, res)
        }
        return res
      }, options?.tx)
    }
    return this.$insert(data, options)
  }

  protected abstract $update(id: string, data: Model.Updatable<M>, options?: Collection.OperationOptions): Promise<M>
  update(id: string, data: Model.Updatable<M>, options?: Collection.OperationOptions): Promise<M> {
    if (this.beforeUpdate || this.afterUpdate) {
      return this.runTx(async tx => {
        const $data = this.beforeUpdate ? await this.beforeUpdate(tx, id, data) : data
        const res = await this.$update(id, $data, { tx })
        if (this.afterUpdate) {
          return this.afterUpdate(tx, res)
        }
        return res
      }, options?.tx)
    }
    return this.$update(id, data, options)
  }

  async runTx<T>(fn: (tx: Transaction) => Promise<T>, tx?: Transaction): Promise<T> {
    let $tx: Transaction
    if (tx) {
      $tx = tx
    } else {
      $tx = await this.db.transaction()
    }
    const txManaged = tx === undefined
    try {
      const res = await fn($tx)
      if (txManaged) {
        await $tx.commit()
      }
      return res
    } catch (e) {
      if (txManaged) {
        await $tx.rollback()
      }
      throw e
    }
  }
}

export namespace Collection {
  export interface Options<M extends Model> {
    name: string
    beforeInsert?: (tx: Transaction, data: Model.Creatable<M>) => Promise<Model.Creatable<M>>
    afterInsert?: (tx: Transaction, data: M) => Promise<M>

    beforeUpdate?: (tx: Transaction, id: string, data: Model.Updatable<M>) => Promise<M>
    afterUpdate?: (tx: Transaction, data: M) => Promise<M>
  }

  export interface OperationOptions {
    tx?: Transaction
  }
}
