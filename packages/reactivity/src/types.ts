export type DepsMap = Map<string, Deps> | undefined

export type Deps = Set<Function> | undefined

export interface EffectFn {
  (): void
  deps: Array<Deps>
}
