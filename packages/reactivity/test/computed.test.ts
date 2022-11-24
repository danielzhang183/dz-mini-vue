import { describe, expect, it } from 'vitest'
import { computed, effect } from '../src'
import { obj } from './fixures'

const sum = computed(() => obj.foo + obj.bar)

describe('computed', () => {
  it.skip('basic', () => {
    expect(sum.value).toBe(3)
    expect(sum.value).toBe(3)
    obj.foo++
    expect(sum.value).toBe(4)
  })

  it('effect', () => {
    effect(() => {
      // eslint-disable-next-line no-console
      console.log(sum.value)
    })

    obj.foo++
    // console.log(sum.value)
  })
})
