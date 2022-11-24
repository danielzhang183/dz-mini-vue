export type DepsMap = Map<string, Deps> | undefined

export type Deps = Set<EffectFn> | undefined

export type EffectScheduler = (...args: any[]) => any

export interface EffectOptions {
  scheduler?: EffectScheduler
  /**
   * @default false
   */
  lazy?: boolean
}

export interface EffectFn {
  (): any
  deps: Array<Deps>
  options: EffectOptions
}
