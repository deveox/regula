import { Flatten } from '@/types/Flatten.js'

export class Filter<M> {
  expression: Filter.Expression<M> = {}
  group?: Filter.Group<M>

  /**
   * Add a filter to the group. Group has monogamous conjunction to simplify the logic of precedence.
   * @param operator - The operator to use when combining filters. `and` or `or`.
   * @param callback - A callback that fills the filter.
   */
  private groupAdd(operator: Filter.Group.Operator, callbackOrFilter: Filter.Callback<M> | Filter<M>) {
    if (!this.group) {
      this.group = {
        operator,
        filters: [],
      }
    }
    let filter: Filter<M>
    if (callbackOrFilter instanceof Filter) {
      filter = callbackOrFilter
    } else {
      filter = new Filter<M>()
      callbackOrFilter(filter)
    }
    this.group.filters.push(filter)
  }

  /**
   * Add an `or` statement to the filter.
   * @param callback - A callback to create the `or` statement.
   */
  or(callback: Filter.Callback<M>) {
    this.groupAdd(Filter.Group.Operator.Or, callback)

    return this as Omit<this, 'and'>
  }
  /**
   * Add an `and` statement to the filter.
   * @param callback - A callback to create the `and` statement.
   */
  and(filter: Filter<M>): Omit<this, 'or'>
  and(callback: Filter.Callback<M>): Omit<this, 'or'>
  and(callback: Filter.Callback<M> | Filter<M>): Omit<this, 'or'> {
    this.groupAdd(Filter.Group.Operator.And, callback)

    return this as Omit<this, 'or'>
  }

  set<K extends keyof Flatten<M>, F extends keyof Filter.Expression.Any<Flatten<M>[K]>>(
    path: K,
    filter: F,
    value: Filter.Expression.Any<Flatten<M>[K]>[F]
  ) {
    if (!this.expression[path]) {
      this.expression[path] = {}
    }
    ;(this.expression[path] as Filter.Expression.Any<Flatten<M>[K]>)[filter] = value
    return this
  }
  /**
   * Selects the documents where the value of a field is an array that contains all the specified elements.
   * @param path - The field to check. Can be a path to a nested field.
   * @param value - An array of values to match against.
   */
  all<K extends keyof Flatten<M> & string>(path: K, value: Flatten<M>[K] extends (infer _R)[] ? Flatten<M>[K] : never[]): this {
    return this.set(path, 'all', value as Flatten<M>[K])
  }

  exists<K extends keyof Flatten<M>>(path: K, value: boolean) {
    return this.set(path, 'exists', value)
  }

  gt<K extends keyof Flatten<M>>(
    path: K,
    value: Flatten<M>[K] extends number ? number : never // if field type is not a number, use of this function should not be allowed
  ) {
    return this.set(path, 'gt', value)
  }

  gte<K extends keyof Flatten<M>>(
    path: K,
    value: Flatten<M>[K] extends number ? number : never // if field type is not a number, use of this function should not be allowed
  ) {
    return this.set(path, 'gte', value)
  }

  lt<K extends keyof Flatten<M>>(
    path: K,
    value: Flatten<M>[K] extends number ? number : never // if field type is not a number, use of this function should not be allowed
  ) {
    return this.set(path, 'lt', value)
  }

  lte<K extends keyof Flatten<M>>(
    path: K,
    value: Flatten<M>[K] extends number ? number : never // if field type is not a number, use of this function should not be allowed
  ) {
    return this.set(path, 'lte', value)
  }

  between<K extends keyof Flatten<M>>(
    path: K,
    min: Flatten<M>[K] extends number ? number : never, // if field type is not a number, use of this function should not be allowed
    max: Flatten<M>[K] extends number ? number : never // if field type is not a number, use of this function should not be allowed
  ) {
    this.gte(path, min)
    return this.lte(path, max)
  }
  in<K extends keyof M>(path: K, values: M[K][]): this
  in<K extends keyof Flatten<M>>(path: K, values: Flatten<M>[K][]) {
    return this.set(path, 'in', values)
  }

  nin<K extends keyof Flatten<M>>(path: K, values: Flatten<M>[K][]) {
    return this.set(path, 'nin', values)
  }

  eq<K extends keyof M>(path: K, value: M[K]): this
  eq<K extends keyof Flatten<M>>(path: K, value: Flatten<M>[K]) {
    return this.set(path, 'eq', value)
  }

  neq<K extends keyof Flatten<M>>(path: K, value: Flatten<M>[K]) {
    return this.set(path, 'neq', value)
  }

  regex<K extends keyof Flatten<M>>(
    path: K,
    regexp: Flatten<M>[K] extends string ? RegExp : never // if field type is not a string, use of this function should not be allowed
  ) {
    return this.set(path, 'regex', regexp)
  }

  like<K extends keyof Flatten<M>>(
    path: K,
    value: Flatten<M>[K] extends string ? string : never // if field type is not a string, use of this function should not be allowed
  ) {
    return this.set(path, 'like', value)
  }

  ilike<K extends keyof Flatten<M>>(
    path: K,
    value: Flatten<M>[K] extends string ? string : never // if field type is not a string, use of this function should not be allowed
  ) {
    return this.set(path, 'ilike', value)
  }

  size<K extends keyof Flatten<M>>(path: K, length: Flatten<M>[K] extends any[] ? number : never) {
    return this.set(path, 'size', length)
  }

  where(filter: Filter<M>) {
    return this.and(filter)
  }
}

export namespace Filter {
  export type Regex<M> = {
    [K in keyof Flatten<M>]?: RegExp
  }
  export type String<M> = {
    [K in keyof Flatten<M>]?: string
  }
  export type Boolean<M> = {
    [K in keyof Flatten<M>]?: boolean
  }

  export type Comparison<M> = {
    [K in keyof Flatten<M>]?: Flatten<M>[K]
  }

  export type Numeric<M> = {
    [K in keyof Flatten<M>]?: number
  }

  export type Search<M> = {
    [K in keyof Flatten<M>]?: Flatten<M>[K][]
  }

  export interface Group<M> {
    /**
     * Define the operator to use when combining filters.
     */
    operator: Group.Operator
    filters: Filter<M>[]
  }

  export namespace Group {
    export enum Operator {
      And = 'and',
      Or = 'or',
    }
  }

  export type Expression<M> = {
    [K in keyof Flatten<M>]?: Flatten<M>[K] extends string
      ? Expression.Strings<Flatten<M>[K]>
      : Flatten<M>[K] extends number
        ? Expression.Numeric<Flatten<M>[K]>
        : Flatten<M>[K] extends any[]
          ? Expression.Arrays<Flatten<M>[K]>
          : Expression.Base<Flatten<M>[K]>
  }

  export namespace Expression {
    export interface Base<T> {
      exists?: boolean
      eq?: T
      neq?: T
      in?: T[]
      nin?: T[]
    }
    export interface Numeric<T> extends Base<T> {
      gt?: number
      gte?: number
      lt?: number
      lte?: number
    }
    export interface Arrays<T> extends Base<T> {
      all?: T
      size?: number
    }

    export interface Strings<T> extends Base<T> {
      regex?: RegExp
      like?: string
      ilike?: string
    }
    export type Any<T> = Numeric<T> & Arrays<T> & Strings<T>
  }

  export type Callback<M> = (filter: Filter<M>) => void
}
