import { useState, useEffect } from 'react';
import Link from 'next/link';

export const Logo = () => {
    const [pathname, setPathname] = useState<string>();
    useEffect(() => {
        typeof window === 'object' && setPathname(window.location.pathname);
    }, []);
    return (
        <Link href="/" className={`${pathname === '/' ? 'invisible' : 'visible'}`}>
            <h1 className="font-squash-h4 w-fit font-flex text-[44px] font-bold leading-none">⚡️</h1>
        </Link>
    );
};
