import { Interface } from './index.js'
import { Model } from './Model.js'
import { Constructor } from '../utils/types.js'

export class Collection<M extends Model, PK extends keyof M> {
  readonly name: string
  driver: Interface.Driver
  Model: Constructor<M>
  primaryKey: PK
  timestamps?: Collection.Config.Timestamps
  beforeCreate: Collection.Config<M, PK>['beforeCreate']
  afterCreate: Collection.Config<M, PK>['afterCreate']
  beforeUpdate: Collection.Config<M, PK>['beforeUpdate']
  afterUpdate: Collection.Config<M, PK>['afterUpdate']
  beforeDelete: Collection.Config<M, PK>['beforeDelete']
  afterDelete: Collection.Config<M, PK>['afterDelete']
  beforeSelect: Collection.Config<M, PK>['beforeSelect']
  afterSelect: Collection.Config<M, PK>['afterSelect']
  constructor(config: Collection.Config<M, PK>) {
    this.name = config.name
    this.Model = config.model
    this.driver = config.driver
    this.beforeCreate = config.beforeCreate
    this.afterCreate = config.afterCreate
    this.beforeUpdate = config.beforeUpdate
    this.afterUpdate = config.afterUpdate
    this.beforeDelete = config.beforeDelete
    this.afterDelete = config.afterDelete
    this.timestamps = config.timestamps === true ? { createdAt: true, updatedAt: true } : undefined
    this.primaryKey = config.primaryKey
  }
  select() {
    return new this.driver.select<M, PK>({
      collection: this,
    })
  }
  create() {
    return new this.driver.create<M, PK>({
      collection: this,
    })
  }
  update() {
    return new this.driver.update<M, PK>({
      collection: this,
    })
  }
  delete() {
    return new this.driver.delete<M, PK>({
      collection: this,
    })
  }
  new() {
    const m = new this.Model()
    return m.$changes.track(m)
  }

  findById(id: M[PK]) {
    return this.select().eq(this.primaryKey, id).one()
  }
}

export namespace Collection {
  export interface Config<M extends Model, PK extends keyof M> {
    name: string
    driver: Interface.Driver
    model: Constructor<M>
    primaryKey: PK
    beforeCreate?: (db: Interface.Transaction, model: Model.Creatable<M>) => Promise<void>
    afterCreate?: (db: Interface.Transaction, model: M) => Promise<void>
    beforeUpdate?: (db: Interface.Transaction, model: M) => Promise<void>
    afterUpdate?: (db: Interface.Transaction, model: M) => Promise<void>
    beforeDelete?: (db: Interface.Transaction, model: M) => Promise<void>
    afterDelete?: (db: Interface.Transaction, model: M) => Promise<void>
    beforeSelect?: (db: Interface.Connection, query: Readonly<Interface.Query.Select<M, PK>>) => Promise<void>
    afterSelect?: (db: Interface.Connection, model: M) => Promise<void>
    timestamps?: boolean | Config.Timestamps
  }

  export namespace Config {
    export interface Timestamps {
      createdAt: boolean
      updatedAt: boolean
    }
  }
}
