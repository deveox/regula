import { Transaction } from './Transaction.js'

/**
 * Represents a database connection.
 */
export abstract class Db {
  protected $isConnected = false
  settings?: Db.Options.Settings
  get isConnected() {
    return this.$isConnected
  }

  abstract $connect(options: Db.Options): Promise<void>
  async connect(options: Db.Options): Promise<void> {
    if (this.$isConnected) {
      throw new Error('Db is already connected')
    }
    this.settings = options.settings
    await this.$connect(options)
    this.$isConnected = true
  }
  abstract $disconnect(): Promise<void>
  async disconnect(): Promise<void> {
    if (this.$isConnected) {
      await this.$disconnect()
      this.$isConnected = false
    }
  }
  config(settings: Db.Options.Settings) {
    this.settings = settings
  }
  abstract tx(): Transaction
  get db(): Db {
    return this
  }
}

export namespace Db {
  export interface Options {
    url: string
    settings?: Options.Settings
  }

  export namespace Options {
    export interface Settings {
      /**
       * If `true`, the driver will throw an error if model(s) to be updated do not have any changes.
       */
      strictUpdates?: boolean
    }
  }
}
