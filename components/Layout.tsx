import { type PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
    className?: string;
};

export function Layout({ children, className }: Props) {
    return <div className={`text-black [min-height:100svh] ${className}`}>{children}</div>;
}
