export abstract class Base<Value, JSONSerialized extends Base.JSON, DBSerialized> {
  abstract to(value: Value): DBSerialized
  abstract from(value: DBSerialized): Value
  abstract toJSON(value: Value): JSONSerialized
  abstract fromJSON(value: JSONSerialized): Value
}

export namespace Base {
  export type JSON = JSON.Primitive | JSON.Object | JSON.Array
  export namespace JSON {
    export type Primitive = string | number | boolean | null
    export type Object = { [P in string]: Primitive | Object | Array }
    export type Array = Primitive[] | Object[] | Array[]
  }
}
