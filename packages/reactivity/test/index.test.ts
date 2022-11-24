/* eslint-disable no-console */
import { describe, it } from 'vitest'
import { effect, track, trigger } from '../src'

const data = {
  ok: true,
  text: 'hellow world',
  foo: 1,
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

describe('effect', () => {
  it.skip('scheduler run', () => {
    effect(() => {
      console.log(obj.foo)
    })

    obj.foo++
    console.log('end')
  })

  it('scheduler run with options', () => {
    effect(() => {
      console.log(obj.foo)
    }, {
      scheduler(fn) {
        setTimeout(fn, 0)
      },
    })

    obj.foo++
    console.log('end')
  })
})
