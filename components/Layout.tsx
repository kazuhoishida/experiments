import { type PropsWithChildren } from 'react';
import { Header } from './Header';

type Props = PropsWithChildren & {
    className?: string;
};

export function Layout({ children, className }: Props) {
    return (
        <div className={`text-black [min-height:100svh] ${className}`}>
            <Header />
            {children}
        </div>
    );
}
