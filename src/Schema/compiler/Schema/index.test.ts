import { describe } from 'bun:test';
import ArrayTest from './Array.test.js';
import BufferTest from './Buffer.test.js';
import ClassTest from './Class.test.js';
import DateTest from './Date.test.js';
import DiscriminatorTest from './Discriminator.test.js';
import LiteralTest from './Literal.test.js';
import MapTest from './Map.test.js';
import ObjectIdTest from './ObjectId.test.js';
import ObjectLiteralTest from './ObjectLiteral.test.js';
import PrimitiveTest from './Primitive.test.js';
import RefTest from './Ref.test.js';
import ReflectedTypeTest from './ReflectedType.test.js';
import UnionTest from './Union.test.js';

export default function () {
  describe('Schema', () => {
    ReflectedTypeTest();
    PrimitiveTest();
    BufferTest();
    DateTest();
    LiteralTest();
    ObjectIdTest();
    RefTest();
    UnionTest();
    ArrayTest();
    MapTest();
    ClassTest();
    ObjectLiteralTest();
    DiscriminatorTest();
  });
}
