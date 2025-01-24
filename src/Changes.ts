import { Flatten } from './types/Flatten.js'

export class Changes<M> {
  data: Partial<Flatten<M>> = {}
  constructor() {
    this.data = {}
  }

  track<T>(target: T, path = ''): T {
    if (typeof target !== 'object' || target === null || Changes.MARK in target) {
      return target
    }
    Object.defineProperty(target, Changes.MARK, { value: true, enumerable: false, configurable: false, writable: false })
    return new Proxy(target as Record<string | symbol, unknown>, {
      get: (target, p, receiver) => {
        const res = Reflect.get(target, p, receiver)
        if (typeof p === 'symbol') {
          return res
        }
        return this.track(res, path ? `${path}.${p}` : p)
      },
      set: (target, p, newValue, receiver) => {
        if (typeof p !== 'symbol') {
          if (Array.isArray(target) && p === 'length') {
            return Reflect.set(target, p, newValue, receiver)
          }
          const field = path ? `${path}.${p}` : p
          if (field in this.data) {
            if (this.data[field as keyof Flatten<M>] === newValue) {
              delete this.data[field as keyof Flatten<M>]
            }
          } else {
            if (target[p] === newValue) {
              return true
            }
            this.data[field as keyof Flatten<M>] = target[p] as any
          }
        }
        return Reflect.set(target, p, newValue, receiver)
      },
    }) as T
  }

  clear() {
    this.data = {}
  }

  has() {
    return Object.keys(this.data).length > 0
  }

  private static MARK = Symbol('Changes.MARK')
}
