import type { ComponentPropsWithoutRef, ElementType } from 'react';

type Props<E extends ElementType = 'div'> = {
    as?: E;
    html?: string;
    className?: string;
} & Omit<ComponentPropsWithoutRef<E>, 'children' | 'dangerouslySetInnerHTML' | 'className'>;

export const HTML = <E extends ElementType = 'div'>({ as, html = '', className, ...rest }: Props<E>) => {
    const Component = (as || 'div') as ElementType;
    return <Component className={className} dangerouslySetInnerHTML={{ __html: html }} {...(rest as object)} />;
};

export default HTML;
