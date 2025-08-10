import * as prismicH from '@prismicio/helpers';

import { Bounded } from '../../components/Bounded';

const Quote = ({ slice }) => {
    return (
        <Bounded as="section" size="wide">
            {prismicH.isFilled.richText(slice.primary.quote) && (
                <div className="font-serif text-3xl italic leading-relaxed">
                    &ldquo;
                    {slice.primary.quote?.[0]?.text || ''}
                    &rdquo;
                    {prismicH.isFilled.keyText(slice.primary.source) && <> &mdash; {slice.primary.source}</>}
                </div>
            )}
        </Bounded>
    );
};

export default Quote;
