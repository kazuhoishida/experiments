import { useState, useEffect } from 'react';
import { PrismicLink } from '@prismicio/react';

export const Logo = () => {
    const [pathname, setPathname] = useState<string>();
    useEffect(() => {
        typeof window === 'object' && setPathname(window.location.pathname);
    }, []);
    return (
        <PrismicLink href="/" className={`${pathname === '/' ? 'invisible' : 'visible'}`}>
            <h1 className="font-squash-h4 w-fit font-flex text-[44px] font-bold leading-none">⚡️</h1>
        </PrismicLink>
    );
};
