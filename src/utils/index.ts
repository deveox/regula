export function get<T extends Record<string, unknown>>(target: T, path: string): unknown | undefined {
  const arr = path.split('.')
  let obj: any = target
  for (const key of arr) {
    if (obj === undefined) {
      return undefined
    }
    obj = obj[key as keyof typeof obj]
  }
  return obj
}
