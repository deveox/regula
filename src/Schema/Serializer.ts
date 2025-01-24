export class Serializer<Value, Serialized = unknown> {
  readonly serialize: Serializer.Config<Value, Serialized>['serialize']
  readonly deserialize: Serializer.Config<Value, Serialized>['deserialize']
  constructor(config: Serializer.Config<Value, Serialized>) {
    this.serialize = config.serialize
    this.deserialize = config.deserialize
  }
}

export namespace Serializer {
  export interface Config<Value, Serialized> {
    serialize(value: Value, operation: Operation): Serialized | undefined
    deserialize(value: Serialized, operation: Operation): Value | undefined
  }

  export enum Operation {
    Read = 'read',
    Create = 'create',
    Update = 'update',
  }

  export namespace Operation {
    export interface Settings {
      [Operation.Read]: boolean
      [Operation.Create]: boolean
      [Operation.Update]: boolean
    }
  }
}
