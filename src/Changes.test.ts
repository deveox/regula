import { describe, expect, it } from 'bun:test'
import { Changes } from './Changes.js'

describe('Changes', () => {
  it('should track', () => {
    const changes = new Changes()
    const data = changes.track({
      name: 'John',
    })
    data.name = 'Jane'
    expect(data.name).toBe('Jane')
    expect(changes.data.name).toBe('John')
    changes.clear()
    expect(changes.data).toEqual({})
    // Check for write operations that don't change the value
    const data2 = changes.track({
      name: 'John',
    })
    data2.name = 'John'
    expect(changes.data).toEqual({})
    data2.name = 'Jane'
    expect(changes.data.name).toBe('John')
    data2.name = 'John'
    expect(changes.data).toEqual({})
  })
  it('should track nested', () => {
    const changes = new Changes()
    const data = changes.track({
      name: 'John',
      address: {
        city: 'New York',
      },
    })
    data.address.city = 'Los Angeles'
    expect(data.address.city).toBe('Los Angeles')
    expect(changes.data['address.city']).toBe('New York')
  })
  it('should track array', () => {
    const changes = new Changes()
    const data = changes.track({
      name: 'John',
      tags: ['a', 'b'],
    })
    data.tags.push('c')
    expect(data.tags).toEqual(['a', 'b', 'c'])
    expect(changes.data['tags.2']).toBe(undefined)
    changes.clear()
    const data2 = changes.track({
      tags: ['a', 'b'],
    })
    data2.tags[0] = 'c'
    expect(data2.tags).toEqual(['c', 'b'])
    expect(changes.data['tags.0']).toBe('a')
  })
})
