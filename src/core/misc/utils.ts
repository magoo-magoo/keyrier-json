export const nameof = <T>(name: keyof T) => name
export const nameofFactory = <T>() => (name: keyof T) => name

export type PropType<T, P extends keyof T = keyof T> = T[P]

export const objectKeys = <T>(obj: T) => {
  return new Set(Object.keys(obj)) as Set<keyof T>
}

export const objectToMap = <T>(obj: T) => {
  const map = new Map<keyof T, PropType<T>>()
  if (!obj) {
    return map
  }
  const keys = objectKeys(obj)
  keys.forEach(key => {
    map.set(key, obj[key])
  })

  return map
}
