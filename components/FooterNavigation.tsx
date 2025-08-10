import { isFilled } from '@prismicio/helpers';
import { PrismicLink, PrismicText } from '@prismicio/react';
import { asText } from '@prismicio/richtext';
import { Provider } from 'jotai';
import { InputHTMLAttributes, PropsWithChildren, useEffect, useState } from 'react';
import type { NavigationDocument, NavigationDocumentDataLinksItem, Simplify } from '../prismic-models';

type NavItemProps = PropsWithChildren & InputHTMLAttributes<HTMLLIElement>;

const NavItem = ({ children, className }: NavItemProps) => <li className={className}>{children}</li>;

type Props = {
    nav: NavigationDocument;
};
const FooterNavigation = ({ nav }: Props) => {
    const [pathname, setPathname] = useState<string>();
    const [loaded, setLoad] = useState<boolean>(false);
    useEffect(() => {
        typeof window === 'object' && setPathname(window.location.pathname);
        setLoad(true);
    }, []);
    const isCurrent = (navItem: Simplify<NavigationDocumentDataLinksItem>) =>
        isFilled.contentRelationship(navItem.link) && navItem.link.url === pathname;

    // set footer navigation visibility
    const [isIntersected, setIntersect] = useState(false);
    useEffect(() => {
        const pageFooter = document.getElementById('page-footer');
        if (pageFooter === null || pageFooter === undefined) return;

        const observer = new IntersectionObserver(([entry]) => setIntersect(entry.isIntersecting), {
            threshold: 0.2,
        });
        observer.observe(pageFooter);

        return () => observer.unobserve(pageFooter);
    }, []);

    return (
        nav && (
            <Provider>
                <div
                    className={`fixed bottom-[2.5vh] left-1/2 z-30 -translate-x-1/2 duration-[400ms] ${
                        pathname === '/'
                            ? 'opacity-100'
                            : isIntersected
                              ? 'pointer-events-none opacity-0'
                              : 'opacity-100'
                    }`}
                >
                    <ul
                        className={`
            flex justify-between gap-x-[12vw] px-8 py-3 font-serif
            text-sm text-white md:gap-x-[42px] ${
                loaded ? 'translate-y-0 bg-v-soft-black/70' : 'translate-y-2 bg-v-soft-black/0'
            } rounded-sm drop-shadow-md backdrop-blur-sm
            delay-[300ms] duration-[400ms] md:hover:bg-black/70
          `}
                    >
                        <NavItem className={`relative ${pathname === '/' ? 'font-bold' : ''}`}>
                            <PrismicLink
                                href="/"
                                className='before:absolute before:-bottom-1 before:left-0 before:block before:h-[1px] before:w-full before:origin-top-left before:scale-0 before:bg-white before:duration-[400ms] before:content-[""] md:hover:before:scale-100'
                            >
                                <PrismicText field={nav.data.homepageLabel} />
                            </PrismicLink>
                        </NavItem>
                        {nav.data.links.map(item => {
                            return (
                                <NavItem
                                    key={asText(item.label)}
                                    className={`relative ${isCurrent(item) ? 'font-bold' : ''}`}
                                >
                                    <PrismicLink
                                        field={item.link}
                                        className='before:absolute before:-bottom-1 before:left-0 before:block before:h-[1px] before:w-full before:origin-top-left before:scale-0 before:bg-white before:duration-[400ms] before:content-[""] md:hover:before:scale-100'
                                    >
                                        <PrismicText field={item.label} />
                                    </PrismicLink>
                                </NavItem>
                            );
                        })}
                    </ul>
                </div>
            </Provider>
        )
    );
};

export default FooterNavigation;
