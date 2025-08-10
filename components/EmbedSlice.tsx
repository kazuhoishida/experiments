import type { EmbedSlice } from '../prismic-models'

const EmbedSlice = ({ slice }: { slice: EmbedSlice }) => (
  <div dangerouslySetInnerHTML={{ __html: slice.primary.content.html ?? '' }} />
)

export default EmbedSlice
