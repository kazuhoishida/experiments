import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const FooterNavigation = () => {
    const router = useRouter();
    const [loaded, setLoad] = useState<boolean>(false);

    useEffect(() => {
        setLoad(true);
    }, []);

    const isCurrent = (path: string) => router.pathname === path;

    return (
        <div className="fixed bottom-[2.5vh] left-1/2 z-30 -translate-x-1/2 opacity-100">
            <ul
                className={`
                    flex justify-between gap-x-[12vw] px-8 py-3 font-serif
                    text-sm text-white md:gap-x-[42px] ${
                        loaded ? 'bg-v-soft-black/70' : 'bg-v-soft-black/0'
                    } rounded-sm drop-shadow-md backdrop-blur-sm
                    delay-[300ms] duration-[400ms] md:hover:bg-black/70
                `}
            >
                <li className={`relative ${isCurrent('/') ? 'font-bold' : ''}`}>
                    <Link href="/">HOME</Link>
                </li>
                <li className={`relative ${isCurrent('/projects') ? 'font-bold' : ''}`}>
                    <Link href="/projects">ALL</Link>
                </li>
            </ul>
        </div>
    );
};

export default FooterNavigation;
