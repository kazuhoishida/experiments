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
    '--cursor-x'?: Coordinate
    '--cursor-y'?: Coordinate
    '--cursor-scale'?: P.Scale
    '--img-ratio'?: P.AspectRatio
    '--len'?: P.GridColumn
    'text-stroke'?: P.TextStroke
    '-webkit-text-stroke'?: P.TextStroke
  }
}
