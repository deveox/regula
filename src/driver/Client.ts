import { DB } from './DB.js'
import { Model } from './Model.js'

export abstract class Client<MBound extends Model> {
  url: string
  constructor(options: Client.Options) {
    this.url = options.url
  }

  abstract db(name: string): DB<MBound>
}

export namespace Client {
  export interface Options {
    url: string
  }
}
