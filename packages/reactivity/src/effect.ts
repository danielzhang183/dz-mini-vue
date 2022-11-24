import type { Deps, DepsMap, EffectFn } from './types'

const targetMap: WeakMap<Object, DepsMap> = new WeakMap()

let activeEffect: EffectFn | undefined
const effectStack: EffectFn[] = []

export function effect(fn: Function) {
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
  const { deps } = effectFn
  if (deps.length) {
    for (let i = 0; i < deps.length; i++)
      deps[i]!.delete(effectFn)
    deps.length = 0
  }
}

export function track(target: any, key: string): void {
  if (!activeEffect)
    return

  let depsMap: DepsMap = targetMap.get(target)
  if (!depsMap)
    targetMap.set(target, (depsMap = new Map()))

  let deps: Deps = depsMap.get(key)
  if (!deps)
    depsMap.set(key, (deps = new Set()))
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

export function trigger(target: any, key: string): boolean {
  const depsMap = targetMap.get(target)
  if (!depsMap)
    return false

  const effects = depsMap.get(key)
  if (!effects)
    return false

  const effectsToRun = new Set(effects)
  effects.forEach((effectFn) => {
    if (effectFn !== activeEffect)
      effectsToRun.add(effectFn)
  })
  effectsToRun.forEach(effectFn => effectFn())
  return true
}
