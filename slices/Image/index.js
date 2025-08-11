import NextImage from 'next/image';
import * as prismicH from '@prismicio/helpers';
import HTML from '../../components/HTML';

import { Bounded } from '../../components/Bounded';

const Image = ({ slice }) => {
    const image = slice.primary.image;

    return (
        <Bounded as="section" size={slice.variation === 'wide' ? 'widest' : 'base'}>
            <figure className="grid grid-cols-1 gap-1">
                {prismicH.isFilled.image(image) && (
                    <div className="bg-gray-100 shadow-md">
                        <NextImage
                            src={prismicH.asImageSrc(image, {
                                w: undefined,
                                h: undefined,
                            })}
                            alt={image.alt}
                            width={image.dimensions.width}
                            height={image.dimensions.height}
                        />
                    </div>
                )}
                {prismicH.isFilled.richText(slice.primary.caption) && (
                    <HTML
                        className="font-serif italic tracking-tight text-slate-500"
                        html={prismicH.asHTML(slice.primary.caption)}
                        as="figcaption"
                    />
                )}
            </figure>
        </Bounded>
    );
};

export default Image;
