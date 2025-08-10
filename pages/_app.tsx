import '../styles/globals.css';
import type { AppProps } from 'next/app';
import type { RichTextMapSerializer, RichTextFunctionSerializer } from '@prismicio/richtext';
import Link from 'next/link';
import type { LinkProps } from 'next/link';
import { repositoryName, linkResolver, createClient } from '../prismicio';
import { isFilled } from '@prismicio/helpers';
import { Heading } from '../components/Heading';
import { Meta } from '../components/Meta';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

type NextLinkShimProps = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode };

const NextLinkShim = ({ href, children, locale, ...props }: NextLinkShimProps) => {
    return (
        <Link href={href} locale={locale} {...props}>
            {children}
        </Link>
    );
};

const richTextComponents: RichTextMapSerializer<JSX.Element> | RichTextFunctionSerializer<JSX.Element> = {
    heading1: ({ children }) => (
        <Heading as="h2" size="3xl" className="mb-7 mt-12 first:mt-0 last:mb-0">
            {children}
        </Heading>
    ),
    heading2: ({ children }) => (
        <Heading as="h3" size="2xl" className="mb-7 last:mb-0">
            {children}
        </Heading>
    ),
    heading3: ({ children }) => (
        <Heading as="h4" size="xl" className="mb-7 last:mb-0">
            {children}
        </Heading>
    ),
    paragraph: ({ children }) => <p className="mb-1 text-base leading-7 last:mb-0">{children}</p>,
    oList: ({ children }) => <ol className="mb-7 pl-4 last:mb-0 md:pl-6">{children}</ol>,
    oListItem: ({ children }) => <li className="mb-1 list-decimal pl-1 last:mb-0 md:pl-2">{children}</li>,
    list: ({ children }) => <ul className="mb-7 pl-4 last:mb-0 md:pl-6">{children}</ul>,
    listItem: ({ children }) => <li className="mb-1 list-disc pl-1 last:mb-0 md:pl-2">{children}</li>,
    preformatted: ({ children }) => (
        <pre className="mb-7 rounded bg-slate-100 p-4 text-sm last:mb-0 md:p-8 md:text-lg">
            <code>{children}</code>
        </pre>
    ),
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    hyperlink: ({ children, node }) => {
        if (isFilled.contentRelationship(node.data)) {
            return (
                <Link href={node.data.url || '#'} className="underline decoration-1 underline-offset-2">
                    {children}
                </Link>
            );
        }
        return <span>{children}</span>;
    },
};

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Meta />
            <Component {...pageProps} />
        </>
    );
}
