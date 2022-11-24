/* eslint-disable no-console */
import { describe, it } from 'vitest'
import { effect } from '../src'
import { flushJob, jobQueue } from '../src/flush'
import { obj } from './fixures'

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
    obj.foo++
  })
})
