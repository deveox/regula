import { Driver } from '@/driver/index.js'
import { Collection } from 'mongodb'
import { SchemaType } from 'mongoose'

export abstract class Base {
  abstract serializer: Driver.Type.Any
  name: string
  scope: Base.Scope
  environment: Base.Environment
  constructor(config: Base.Config) {
    this.name = config.name
    this.scope = config.scope ?? Base.Scope.Any
    this.environment = config.environment ?? Base.Environment.Any
  }
}

export namespace Base {
  export interface Config {
    name: string
    scope?: Scope
    environment?: Environment
  }

  export enum Scope {
    Read = 'read',
    Create = 'create',
    Update = 'update',
    /**
     * Create and Update
     */
    Write = 'write',
    ReadCreate = 'read-create',
    ReadUpdate = 'read-update',
    Any = 'any',
  }

  export enum Environment {
    DB = 'db',
    HTTP = 'http',
    Any = 'any',
  }
}
