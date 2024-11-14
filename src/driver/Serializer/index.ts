import { Bool } from './Bool.js'
import { Int32 } from './Int32.js'
import { Int64 } from './Int64.js'
import { Text } from './Text.js'

export * from './Int32.js'
export * from './Int64.js'
export * from './Text.js'
export * from './Bool.js'

export type Any = Int32<any> | Int64<any> | Text<any> | Bool<any>

export * as Serializer from './index.js'
