import type { Deps, DepsMap, EffectFn, EffectOptions } from './types'

const targetMap: WeakMap<Object, DepsMap> = new WeakMap()

let activeEffect: EffectFn | undefined
const effectStack: EffectFn[] = []

export function effect(fn: Function, options?: EffectOptions) {
  const effectFn: EffectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    const res = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return res
  }

  effectFn.options = options || {}
  effectFn.deps = []
  if (!options?.lazy)
    effectFn()

  return effectFn
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
  effects.forEach((effect) => {
    if (effect !== activeEffect)
      effectsToRun.add(effect)
  })
  effectsToRun.forEach((effectFn) => {
    if (effectFn.options.scheduler)
      effectFn.options.scheduler(effectFn)
    else
      effectFn()
  })
  return true
}
