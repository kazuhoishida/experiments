import type { SliceComponentProps } from '@prismicio/react'
import type { EmbedSlice } from '../prismic-models'

const EmbedSlice = ({ slice }: SliceComponentProps<EmbedSlice>) => (
  <div dangerouslySetInnerHTML={{ __html: slice.primary.content.html ?? '' }} />
)

export default EmbedSlice
