import { ReflectionVisibility } from '@deepkit/type'

export type Visibility = 'private' | 'protected' | 'public'

export namespace Visibility {
  export function fromDeepkit(v: ReflectionVisibility): Visibility {
    switch (v) {
      case ReflectionVisibility.private:
        return 'private'
      case ReflectionVisibility.protected:
        return 'protected'
      default:
        return 'public'
    }
  }
}
