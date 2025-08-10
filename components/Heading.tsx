import clsx from 'clsx';
import type { ComponentType, ReactNode } from 'react';

type HeadingSize = '4xl' | '3xl' | '2xl' | 'xl';

type HeadingProps = {
    as?: keyof React.JSX.IntrinsicElements | ComponentType<any>;
    size?: HeadingSize;
    children: ReactNode;
    className?: string;
};

export const Heading = ({ as: Comp = 'h1', size = '4xl', children, className }: HeadingProps) => {
    const Component = Comp as any;
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
