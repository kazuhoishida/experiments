import * as prismicH from '@prismicio/helpers';
import HTML from '../../components/HTML';
import { Bounded } from '../../components/Bounded';

const Text = ({ slice }) => {
    return (
        <Bounded as="section">
            {prismicH.isFilled.richText(slice.primary.text) && (
                <HTML
                    className="font-serif leading-relaxed md:text-xl md:leading-relaxed"
                    html={prismicH.asHTML(slice.primary.text)}
                />
            )}
        </Bounded>
    );
};

export default Text;
