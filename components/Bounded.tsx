import clsx from 'clsx';
import type { ComponentType, ReactNode } from 'react';

type BoundedSize = 'small' | 'base' | 'wide' | 'widest';

type BoundedProps = {
    as?: keyof JSX.IntrinsicElements | ComponentType<any>;
    size?: BoundedSize;
    className?: string;
    children?: ReactNode;
};

export const Bounded = ({ as: Comp = 'div', size = 'base', className, children }: BoundedProps) => {
    return (
        <Comp className={className}>
            <div
                className={clsx(
                    'mx-auto w-full',
                    size === 'small' && 'max-w-xl',
                    size === 'base' && 'max-w-3xl',
                    size === 'wide' && 'max-w-4xl',
                    size === 'widest' && 'max-w-6xl'
                )}
            >
                {children}
            </div>
        </Comp>
    );
};
