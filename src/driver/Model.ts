export interface Model {}

export namespace Model {
  export type Creatable<Model> = Model // TODO
  export type Updatable<Model> = Model // TODO
  export type Readable<Model> = Model // TODO

  export type PKBound<Model> = keyof Model
}
