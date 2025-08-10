import * as prismicH from '@prismicio/helpers';

const Works = ({ slice }) => (
    <section>
        <span className="title">
            {slice.primary.title ? (
                <div dangerouslySetInnerHTML={{ __html: prismicH.asHTML(slice.primary.title) }} />
            ) : (
                <h2>Template slice, update me!</h2>
            )}
        </span>
        {slice.primary.description ? (
            <div dangerouslySetInnerHTML={{ __html: prismicH.asHTML(slice.primary.description) }} />
        ) : (
            <p>start by editing this slice from inside Slice Machine!</p>
        )}
        <style jsx>{`
            section {
                max-width: 600px;
                margin: 4em auto;
                text-align: center;
            }
            .title {
                color: #8592e0;
            }
        `}</style>
    </section>
);

export default Works;
