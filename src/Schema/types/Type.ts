import { Serializer } from '../Serializer.js'

export abstract class Type<Value> {
  abstract json: Serializer<Value>
  abstract db: Serializer<Value>
}

export namespace Type {
  export type Json = Json.Primitive | Json.Object | Json.Array
  export namespace Json {
    export type Primitive = string | number | boolean | null | unknown
    export type Object = { [P in string]: Primitive | Object | Array }
    export type Array = Primitive[] | Object[] | Array[]
  }
}
