import mongoose from 'mongoose'
/**
 * Extended mongoose Document, runtime exists only during Schema creation
 * @reflection never
 */
export class Document {
  // declare $$document: true
  // defaults?: Document.Defaults<this>
  // protected $default<K extends keyof NonNullable<this['defaults']>>(k: K, v: NonNullable<this['defaults']>[K]) {
  //   if (!this.defaults) this.defaults = {} as Document.Defaults<this>
  //   ;(this.defaults as NonNullable<this['defaults']>)[k] = v
  // }
}

export namespace Document {
  export type Defaults<D extends Document> = {
    [K in Exclude<keyof D, keyof mongoose.Document>]?: (this: D) => NonNullable<D[K]>
  }

  export type Hydrated<D extends Document> = D &
    Omit<mongoose.Document, '_id' | '__v'> & {
      __v?: number
    }
}
