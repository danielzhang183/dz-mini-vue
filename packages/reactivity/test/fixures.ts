import { track, trigger } from '../src'

const data = {
  ok: true,
  text: 'hellow world',
  foo: 1,
  bar: 2,
}

export const obj = new Proxy(data, {
  get(target: any, key: string) {
    track(target, key)
    return target[key]
  },
  set(target, key: string, newVal) {
    target[key] = newVal
    return trigger(target, key)
  },
})
