import clsx from 'clsx';
import type { ReactNode, ElementType } from 'react';

type HeadingSize = '4xl' | '3xl' | '2xl' | 'xl';

type HeadingProps<C extends ElementType = 'h1'> = {
    as?: C;
    size?: HeadingSize;
    children: ReactNode;
    className?: string;
};

export const Heading = <C extends ElementType = 'h1'>({
    as: Comp = 'h1' as C,
    size = '4xl',
    children,
    className,
}: HeadingProps<C>) => {
    const Component = Comp || ('h1' as ElementType);
    return (
        <Component
            className={clsx(
                'font-source font-semibold tracking-tighter',
                size === '4xl' && 'text-3xl md:text-4xl',
                size === '3xl' && 'text-3xl',
                size === '2xl' && 'text-2xl',
                size === 'xl' && 'text-xl',
                className
            )}
        >
            {children}
        </Component>
    );
};
