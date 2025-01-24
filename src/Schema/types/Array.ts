import { Serializer } from '../Serializer.js'
import { Type } from './Type.js'

export abstract class Arr extends Type<unknown[]> {
  element: Type<unknown>
  json: Serializer<unknown[], unknown[]>
  constructor(element: Type<unknown>) {
    super()
    this.element = element
    this.json = new Serializer<unknown[], unknown[]>({
      serialize: (value, operation) => {
        const serialized: unknown[] = []
        for (const element of value) {
          const res = this.element.json.serialize(element, operation)
          if (res !== undefined) {
            serialized.push(res)
          }
        }
        return serialized.length ? serialized : undefined
      },
      deserialize: (value, operation) => {
        const deserialized: unknown[] = []
        for (const element of value) {
          const res = this.element.json.deserialize(element, operation)
          if (res !== undefined) {
            deserialized.push(res)
          }
        }
        return deserialized
      },
    })
  }
}
