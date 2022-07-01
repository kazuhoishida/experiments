import type * as CSS from 'csstype'
import type { Property as P } from 'csstype'

type Coordinate = P.Top | P.Right | P.Bottom | P.Left
type Size = P.Width | P.Height

declare module 'csstype' {
  interface Properties {
    '--scale-x'?: P.Scale
    '--translateY'?: P.Translate
    '--visibility'?: P.Visibility
    '--icon-size'?: Size
    '--padding-x'?: Coordinate
    '--cursol-x'?: Coordinate
    '--cursol-y'?: Coordinate
    '--cursol-scale'?: P.Scale
  }
}
