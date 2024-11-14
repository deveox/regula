export namespace BSON {
  /**
   * https://www.mongodb.com/docs/manual/reference/bson-types/#std-label-bson-types
   */
  export enum Type {
    Null = 'null',
    Boolean = 'bool',
    String = 'string',
    Date = 'date',
    Timestamp = 'timestamp',
    Double = 'double',
    Decimal = 'decimal',
    Decimal128 = 'decimal128',
    Int32 = 'int',
    Int64 = 'long',
    Object = 'object',
    Array = 'array',
    Binary = 'binData',
    ObjectId = 'objectId',
    RegExp = 'regex',
    JavaScript = 'javascript',
  }

  export type Schema<P extends Record<string, Schema.Any>> = Schema.Object<P>

  export namespace Schema {
    interface Base {
      /**
       * The BSON type of the field. https://www.mongodb.com/docs/manual/reference/bson-types/#std-label-bson-types
       */
      bsonType: Type
      description?: string
      title?: string
    }

    export interface Object<P extends Record<string, Any>> extends Base {
      bsonType: Type.Object
      /**
       * If `true`, additional fields are allowed. If `false`, they are not.
       */
      additionalProperties?: boolean
      maxProperties?: number
      minProperties?: number
      properties: P
      required?: (keyof P)[]
    }

    export interface String extends Base {
      bsonType: Type.String
      maxLength?: number
      minLength?: number
      pattern?: string
    }

    export interface Number extends Base {
      bsonType:
        | Type.Double
        | Type.Int32
        | Type.Int64
        | Type.Decimal
        | Type.Decimal128
      maximum?: number
      exclusiveMaximum?: boolean
      minimum?: number
      exclusiveMinimum?: boolean
    }

    export interface Boolean extends Base {
      bsonType: Type.Boolean
    }

    export interface Date extends Base {
      bsonType: Type.Date
    }

    export interface Timestamp extends Base {
      bsonType: Type.Timestamp
    }

    export interface ObjectId extends Base {
      bsonType: Type.ObjectId
    }

    export interface RegExp extends Base {
      bsonType: Type.RegExp
    }

    export interface JavaScript extends Base {
      bsonType: Type.JavaScript
    }

    export interface Binary extends Base {
      bsonType: Type.Binary
      /**
       * The binary subtype. https://www.mongodb.com/docs/manual/reference/bson-types/#std-label-bson-types-binary
       */
      subtype: Binary.Subtype
    }

    export namespace Binary {
      export enum Subtype {
        /**
         * Generic binary subtype
         */
        Any = 0,
        /**
         * Function data
         */
        Function = 1,
        /**
         * Binary (old)
         */
        BinaryOld = 2,
        /**
         * UUID (old)
         */
        UUIDOld = 3,
        /**
         * UUID
         */
        UUID = 4,
        /**
         * MD5
         */
        MD5 = 5,
        /**
         * Encrypted BSON value
         */
        EncryptedBSON = 6,
        /**
         * 	Compressed time series data
         */
        CompressedTimeseries = 7,
        /**
         * Sensitive data, such as a key or secret. MongoDB does not log literal values for binary data with subtype 8. Instead, MongoDB logs a placeholder value of ###.
         */
        Sensitive = 8,
        /**
         * Vector data, which is densely packed arrays of numbers of the same type.
         */
        Vector = 9,
        /**
         * Custom data
         */
        Custom = 128,
      }
    }

    export interface Array<E extends Any> extends Base {
      bsonType: Type.Array
      items: E
      maxItems?: number
      minItems?: number
      uniqueItems?: boolean
      /**
       * If an object, must be a valid JSON Schema
       */
      additionalItems?: boolean
    }

    export type Any =
      | Object<Record<string, Any>>
      | Array<Any>
      | String
      | Number
      | Boolean
      | Date
      | Timestamp
      | ObjectId
      | RegExp
      | JavaScript
      | Binary
  }
}
