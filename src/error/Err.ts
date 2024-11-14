export class Err extends Error {
  code: Err.Code
  constructor(message: string, code: Err.Code = Err.Code.Internal) {
    super(message)
    this.code = code
  }
}

export namespace Err {
  export enum Code {
    NotFound = 404,
    Internal = 500,
  }
}
