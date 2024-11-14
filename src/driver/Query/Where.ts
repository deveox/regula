import { Model } from '../Model.js'

export class Where<MBound extends Model, M extends MBound> {}

export namespace Where {
  export interface Options<MBound extends Model, M extends MBound> {}
}
