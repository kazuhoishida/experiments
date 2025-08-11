import clsx from 'clsx';
import type { ReactNode, ElementType } from 'react';

type BoundedSize = 'small' | 'base' | 'wide' | 'widest';

type BoundedProps<C extends ElementType = 'div'> = {
    as?: C;
    size?: BoundedSize;
    className?: string;
    children?: ReactNode;
};

export const Bounded = <C extends ElementType = 'div'>({
    as: Comp = 'div' as C,
    size = 'base',
    className,
    children,
}: BoundedProps<C>) => {
    const Component = Comp || ('div' as ElementType);
    return (
        <Component className={className}>
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
        </Component>
    );
};
