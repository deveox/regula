import { TypeClass as DeepKitTypeClass } from '@deepkit/type'
import { ClassType } from '@deepkit/core'

export interface TypeClass<T extends ClassType = any> extends DeepKitTypeClass {
  classType: T
}
