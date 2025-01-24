export type Constructor<T> = new (...args: any[]) => T

export type KeyofUnion<T> = T extends any ? keyof T : never
