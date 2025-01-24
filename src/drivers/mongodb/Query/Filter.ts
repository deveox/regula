import { Interface } from '@/Interface/index.js'
import { Flatten } from '@/types/Flatten.js'
import mongodb from 'mongodb'

export namespace Filter {
  export function fromQueryFilter<M>(filter: Interface.Query.Filter<M>): mongodb.Filter<Flatten<M>> {
    const res = parseExpression(filter.expression)
    if (filter.group) {
      const arr: mongodb.Filter<Flatten<M>>[] = []
      for (const f of filter.group.filters) {
        arr.push(fromQueryFilter(f))
      }
      const key: `$${Interface.Query.Filter.Group.Operator}` = `$${filter.group.operator}`
      res[key] = arr as mongodb.Filter<mongodb.WithId<Flatten<M>>>[]
    }
    return res
  }

  function parseExpression<M>(expression: Interface.Query.Filter.Expression<M>) {
    const res: mongodb.Filter<Flatten<M>> = {}
    for (const k in expression) {
      const v = expression[k as keyof Interface.Query.Filter.Expression<M>]
      if (v === undefined) continue
      if (v?.exists) {
        res[k as keyof Flatten<M>] = { ...res[k], $exists: v.exists }
      }
      if (v?.eq) {
        res[k as keyof Flatten<M>] = { ...res[k], $eq: v.eq }
      }
      if (v?.neq) {
        res[k as keyof Flatten<M>] = { ...res[k], $ne: v.neq }
      }
      if (v?.in) {
        res[k as keyof Flatten<M>] = { ...res[k], $in: v.in }
      }
      if (v?.nin) {
        res[k as keyof Flatten<M>] = { ...res[k], $nin: v.nin }
      }
      if ('regex' in v) {
        res[k as keyof Flatten<M>] = { ...res[k], $regex: v.regex }
      }
      if ('search' in v) {
        res[k as keyof Flatten<M>] = { ...res[k], $in: v.search }
      }
      if ('like' in v) {
        throw new Error('Not implemented')
      }
      if ('ilike' in v) {
        throw new Error('Not implemented')
      }
      if ('all' in v) {
        res[k as keyof Flatten<M>] = { ...res[k], $all: v.all }
      }
      if ('size' in v) {
        res[k as keyof Flatten<M>] = { ...res[k], $size: v.size }
      }
      if ('gt' in v) {
        res[k as keyof Flatten<M>] = { ...res[k], $gt: v.gt }
      }
      if ('gte' in v) {
        res[k as keyof Flatten<M>] = { ...res[k], $gte: v.gte }
      }
      if ('lt' in v) {
        res[k as keyof Flatten<M>] = { ...res[k], $lt: v.lt }
      }
      if ('lte' in v) {
        res[k as keyof Flatten<M>] = { ...res[k], $lte: v.lte }
      }
    }
    return res
  }
}
