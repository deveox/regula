import { Serializer } from '../Serializer.js'
import { Property } from './Property.js'
import { Type } from './Type.js'

export abstract class Document extends Type<Record<string, unknown>> {
  properties: Record<string, Property>
  json: Serializer<Record<string, unknown>, Record<string, unknown>>
  constructor(properties: Record<string, Property>) {
    super()
    this.properties = properties
    this.json = new Serializer<Record<string, unknown>, Record<string, unknown>>({
      serialize(value, operation) {
        const serialized: Record<string, unknown> = {}
        let empty = true
        for (const key in properties) {
          const res = properties[key].json.serialize(value[key], operation)
          if (res !== undefined) {
            empty = false
            serialized[key] = res
          }
        }
        if (empty) {
          return undefined
        }
        return serialized
      },
      deserialize(value, operation) {
        const deserialized: Record<string, unknown> = {}
        let empty = true
        for (const key in properties) {
          const res = properties[key].json.deserialize(value[key], operation)
          if (res !== undefined) {
            empty = false
            deserialized[key] = res
          }
        }
        if (empty) {
          return undefined
        }
        return deserialized
      },
    })
  }
}
