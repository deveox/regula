import { db } from '@/test/db.js'
import { describe, it } from 'bun:test'
import { BSONType } from 'mongodb'
import { BSON } from './bson.js'
describe('Boolean', () => {
  it('works', async () => {
    const c = await db.createCollection('test', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['foo'],
          properties: {
            foo: {
              bsonType: BSON.Type.Boolean,
            },
          },
        },
      },
    })
    console.log(c)
  })
})
