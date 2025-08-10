import * as prismicH from '@prismicio/helpers';

import { Bounded } from '../../components/Bounded';

const Text = ({ slice }) => {
    return (
        <Bounded as="section">
            {prismicH.isFilled.richText(slice.primary.text) && (
                <div
                    className="font-serif leading-relaxed md:text-xl md:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: prismicH.asHTML(slice.primary.text) }}
                />
            )}
        </Bounded>
    );
};

export default Text;
