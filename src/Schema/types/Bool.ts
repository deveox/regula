import { Serializer } from '../Serializer.js'
import { Type } from './Type.js'

export abstract class Bool extends Type<boolean> {
  json = new Serializer<boolean, boolean>({
    serialize(value) {
      return value
    },
    deserialize(value) {
      return value
    },
  })
}
