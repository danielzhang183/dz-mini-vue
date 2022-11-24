/* eslint-disable no-console */
export type DepsMap = Map<string, Deps> | undefined

export type Deps = Set<Function> | undefined

export interface EffectFn {
  (): void
  deps: Array<Deps>
}

const bucket: WeakMap<Object, DepsMap> = new WeakMap()

const data = {
  ok: true,
  text: 'hellow world',
}

let activeEffect: EffectFn | undefined
const effectStack: EffectFn[] = []

function effect(fn: Function) {
  const effectFn: EffectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }

  effectFn.deps = []
  effectFn()
}

function cleanup(effectFn: EffectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps?.delete(effectFn)
  }

  effectFn.deps.length = 0
}

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

effect(() => {
  console.log('effect run')
  console.log(obj.ok ? obj.text : 'not')
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
  activeEffect.deps.push(deps)
}

function trigger(target: any, key: string): boolean {
  const depsMap = bucket.get(target)
  if (!depsMap)
    return false

  const effects = depsMap.get(key)
  if (!effects)
    return false

  const effectsToRun = new Set(effects)
  effectsToRun.forEach(effectFn => effectFn())
  return true
}

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)
