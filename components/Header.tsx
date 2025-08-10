import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { isFilled } from '@prismicio/helpers';
import type { NavigationDocument } from '../prismic-models';
import Bubble from './Bubble';
import clsx from 'clsx';
import { getTextFromField } from '../utils/prismic';
import { Logo } from './Logo';
import { useAtomValue, useSetAtom } from 'jotai';
import { FeaturedProjectsAtom } from '../stores';
import { useRouter } from 'next/router';
import { BubbleAtom } from '../stores/BubbleAtom';
import CubeIcon from '../components/CubeIcon';
import type { LinkToMediaField } from '@prismicio/types';
import type { FeaturedProject } from '../fetches/featuredProject';

type Props = {
    nav: NavigationDocument;
};

type NavItemProps = {
    children: React.ReactNode;
    item: any;
};

const NavItem = ({ item, children }: NavItemProps) => {
    const setBubbleThumb = useSetAtom(BubbleAtom);
    const setThumbnail = () => {
        if (!item || typeof item !== 'object') return;
        const data = (item as any).data;
        const fm = (data?.featuredMedia ?? null) as LinkToMediaField | null;
        if (fm && isFilled.linkToMedia(fm)) {
            setBubbleThumb(fm.url ?? '');
        }
    };
    return (
        <li
            className="text-[36px] font-[640] leading-none duration-[300ms] md:hover:translate-x-4 md:hover:opacity-50"
            onMouseEnter={setThumbnail}
        >
            {children}
        </li>
    );
};

type FeaturedProjectProps = {
    project: FeaturedProject;
};

const FeaturedProjectItem = ({ project }: FeaturedProjectProps) => {
    if (!isFilled.contentRelationship(project) || !isFilled.contentRelationship(project.data?.creator)) {
        return <></>;
    }
    const name = (project.data?.creator?.data as { name?: string } | null)?.name;
    return <h2 className="whitespace-nowrap text-[36px]">{project.data?.title || ''}</h2>;
};

const Navigation = ({ nav }: Props) => {
    const featuredProjects = useAtomValue(FeaturedProjectsAtom);

    return (
        nav && (
            <div className="z-1 inline-flex flex-col gap-y-[30px] md:w-auto md:gap-y-[7vh]">
                <nav className="font-bold-h1 font-flex text-white">
                    <ul className="inline-flex flex-col justify-center gap-y-[30px]">
                        <li className="text-[36px] font-[640] leading-none duration-[300ms] md:hover:translate-x-4 md:hover:opacity-50">
                            <Link href="/" className="outline-0">
                                {getTextFromField(nav.data.homepageLabel)}
                            </Link>
                        </li>
                        {nav.data.links.map(item => (
                            <NavItem key={getTextFromField(item.label)} item={item}>
                                <Link
                                    href={
                                        item.link.url ||
                                        `/${item.link.type === 'page' ? item.link.uid : item.link.type}/${item.link.uid}`
                                    }
                                    className="outline-0"
                                >
                                    {getTextFromField(item.label)}
                                </Link>
                            </NavItem>
                        ))}
                    </ul>
                </nav>
                <nav className="font-bold-h1 font-flex text-black">
                    <ul className="flex flex-col justify-center gap-y-[30px]">
                        {(featuredProjects as any)?.data?.projects?.map(
                            ({ project }: any) =>
                                isFilled.contentRelationship(project) && (
                                    <NavItem key={project.id} item={project}>
                                        <Link
                                            href={isFilled.contentRelationship(project) ? project.url || '#' : '#'}
                                            className="outline-0"
                                        >
                                            <FeaturedProjectItem project={project} />
                                        </Link>
                                    </NavItem>
                                )
                        )}
                    </ul>
                </nav>
            </div>
        )
    );
};

function MenuModal({ nav, isOpen }: { nav: NavigationDocument; isOpen: boolean }) {
    const [isWide, setWide] = useState(false);
    useEffect(() => {
        setWide(window.screen.width >= 1140);

        const handleResize = () => {
            setWide(window.screen.width >= 1140);
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-30" onClose={() => {}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
                <div className="fixed inset-0">
                    <div className="flex min-h-full items-center justify-center text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="h-screen w-screen transform overflow-hidden text-left align-middle shadow-xl transition-all [height:100svh]">
                                <div
                                    className={clsx(
                                        'h-full w-full bg-v-dark-gray px-[10vw] transition-all delay-300 md:pl-[10vw] md:pr-0',
                                        { 'opacity-0': !isOpen }
                                    )}
                                >
                                    <div className="no-scrollbar relative z-10 inline-block h-full overflow-y-auto py-[10vh] md:pr-4">
                                        <Navigation nav={nav} />
                                    </div>
                                </div>
                                {isWide && (
                                    <div className="fixed top-0 right-0 z-0 hidden h-full w-full cursor-grab md:block">
                                        <Bubble />
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export function Header({ nav }: Props) {
    const router = useRouter();
    const [isOpen, toggle] = useState(false);
    useEffect(() => {
        toggle(false);
    }, [router.asPath]);
    const toggleMenu = () => toggle(!isOpen);
    return (
        <header className="sticky top-0 left-0 z-50 flex w-full items-center justify-between pl-4 pr-2 xs:py-0">
            <Logo />
            <div className="relative h-20 w-20" onClick={toggleMenu}>
                <CubeIcon />
            </div>
            <MenuModal nav={nav} isOpen={isOpen} />
        </header>
    );
}
