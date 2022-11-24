/* eslint-disable no-console */
import { describe, it } from 'vitest'
import { effect, track, trigger } from '../src'
import { flushJob, jobQueue } from '../src/flush'

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
  })

  it.skip('scheduler run with options', () => {
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

  it('flush job', () => {
    effect(() => {
      console.log(obj.foo)
    }, {
      scheduler(fn) {
        jobQueue.add(fn)
        flushJob()
      },
    })
    obj.foo++
    console.log(jobQueue.size)
    obj.foo++
    console.log(jobQueue.size)
  })
})
