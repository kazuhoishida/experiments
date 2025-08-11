import type { EmbedSlice } from '../prismic-models';
import HTML from './HTML';

const EmbedSlice = ({ slice }: { slice: EmbedSlice }) => <HTML html={slice.primary.content.html ?? ''} />;

export default EmbedSlice;
