import { ReflectionVisibility } from '@deepkit/type';
import { Visibility } from './visibility.js';

export class UnsupportedTypeError extends Error {
  constructor(
    public path: string,
    public type: string,
    message: string = ''
  ) {
    super(`[${path}] unsupported schema type: ${type}. ${message}`);
  }
}

export class WrongTypeError extends Error {
  constructor(
    public path: string,
    actual: string,
    wanted: string,
    message: string = ''
  ) {
    super(`[${path}] has wrong schema type: ${actual}. Should be ${wanted}. ${message}`);
  }
}

export class UnsupportedKeyTypeError extends Error {
  constructor(
    public path: string,
    public type: string,
    public override message: string = ''
  ) {
    super(`[${path}] has unsupported key type: ${type}. Only string keys are supported. ${message}`);
  }
}

export class WrongVisibilityError extends Error {
  wanted: Visibility[];
  constructor(
    public path: string,
    actual: ReflectionVisibility,
    ...wanted: Visibility[]
  ) {
    super(`[${path}] has wrong visibility: ${Visibility.fromDeepkit(actual)}. Should be ${wanted.join(' or ')}.`);
    this.wanted = wanted;
  }
}

export class WrongModifierError extends Error {
  constructor(
    public path: string,
    public actual: 'optional' | 'required',
    public wanted: 'optional' | 'required',
    public override message: string = ''
  ) {
    super(`[${path}] is ${actual} but should be ${wanted}. ${message}`);
  }
}
