/* eslint-disable no-console */
export type DepsMap = Map<string, Deps> | undefined

export type Deps = Set<Function> | undefined

const bucket: WeakMap<Object, DepsMap> = new WeakMap()

const data = {
  text: 'hellow world',
}

let activeEffect: Function | undefined

function effect(fn: Function) {
  activeEffect = fn
  fn()
}

effect(() => {
  console.log('effect run')
  console.log(data.text)
})

const obj = new Proxy(data, {
  get(target: any, key: string) {
    track(target, key)
    return target[key]
  },
  set(target, key: string, newVal) {
    target[key] = newVal
    return trigger(target, key)
  },
})

function track(target: any, key: string): void {
  if (!activeEffect)
    return

  let depsMap: DepsMap = bucket.get(target)
  if (!depsMap)
    bucket.set(target, (depsMap = new Map()))

  let deps: Deps = depsMap.get(key)
  if (!deps)
    depsMap.set(key, (deps = new Set()))
  deps.add(activeEffect)
}

function trigger(target: any, key: string): boolean {
  const depsMap = bucket.get(target)
  if (!depsMap)
    return false

  const effects = depsMap.get(key)
  if (!effects)
    return false

  effects.forEach(fn => fn())
  return true
}

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)
