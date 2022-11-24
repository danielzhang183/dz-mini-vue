export type DepsMap = Map<string, Deps> | undefined

export type Deps = Set<EffectFn> | undefined

export type EffectScheduler = (...args: any[]) => any

export interface EffectOptions {
  scheduler?: EffectScheduler
}

export interface EffectFn {
  (): void
  deps: Array<Deps>
  options: EffectOptions
}
