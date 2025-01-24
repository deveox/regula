import { Serializer } from '../Serializer.js'
import { Type } from './Type.js'

export class Property<Value = unknown> extends Type<Value> {
  scope: Property.Scope.Settings
  type: Type<Value>
  json: Serializer<Value>
  db: Serializer<Value>
  constructor(config: Property.Config<Value>) {
    super()
    this.type = config.type
    this.scope = {
      [Property.Scope.Db]: {
        [Serializer.Operation.Update]: config.scope?.[Property.Scope.Db]?.[Serializer.Operation.Update] ?? true,
        [Serializer.Operation.Create]: config.scope?.[Property.Scope.Db]?.[Serializer.Operation.Create] ?? true,
        [Serializer.Operation.Read]: true, // todo
      },
      [Property.Scope.Json]: {
        [Serializer.Operation.Read]: config.scope?.[Property.Scope.Json]?.[Serializer.Operation.Read] ?? true,
        [Serializer.Operation.Create]: config.scope?.[Property.Scope.Json]?.[Serializer.Operation.Create] ?? true,
        [Serializer.Operation.Update]: config.scope?.[Property.Scope.Json]?.[Serializer.Operation.Update] ?? true,
      },
    }
    this.json = new Serializer<Value>({
      serialize: (value, operation) => {
        if (this.scope[Property.Scope.Json][operation]) {
          return this.type.json.serialize(value, operation)
        }
        return undefined
      },
      deserialize: (value, operation) => {
        if (value && this.scope[Property.Scope.Json][operation]) {
          return this.type.json.deserialize(value, operation)
        }
        return undefined
      },
    })
    this.db = new Serializer<Value>({
      serialize: (value, operation) => {
        if (this.scope[Property.Scope.Db][operation]) {
          return this.type.db.serialize(value, operation)
        }
        return undefined
      },
      deserialize: (value, operation) => {
        if (value && this.scope[Property.Scope.Db][operation]) {
          return this.type.db.deserialize(value, operation)
        }
        return undefined
      },
    })
  }
}

export namespace Property {
  export enum Scope {
    Db = 'db',
    Json = 'json',
  }

  export namespace Scope {
    export interface Settings {
      [Scope.Db]: Serializer.Operation.Settings
      [Scope.Json]: Serializer.Operation.Settings
    }
  }

  export interface Config<Value> {
    scope?: Partial<Scope.Settings>
    type: Type<Value>
  }
}
