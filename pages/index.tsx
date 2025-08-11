import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/navigation';
import { isFilled } from '@prismicio/helpers';
import { createClient } from '../prismicio';
import { FeaturedProjectsAtom } from '../stores';
import { fetchFeaturedProjects } from '../fetches';
import { Layout } from '../components/Layout';
import { Navigation, A11y, EffectCreative, Mousewheel, FreeMode } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRef, forwardRef, useState, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import FooterNavigation from '../components/FooterNavigation';
import Head from 'next/head';
import Image from 'next/image';
import type { FeaturedProject, FeaturedProjects } from '../fetches/featuredProject';
import type { NavigationDocument, SettingsDocument, TopDocument } from '../prismic-models';
import type { Swiper as SwiperClass } from 'swiper';
import Link from 'next/link';
import gsap from 'gsap';
import { getTextFromField } from '../utils/prismic';

type ProjectProps = {
    no: number;
    project: FeaturedProject;
    length: number;
};
const Project = ({ no, project, length }: ProjectProps) => {
    useEffect(() => {
        gsap.to('.featured-project-card', {
            delay: 0.5,
            stagger: 0.1,
            opacity: 1,
            ease: 'power2.out',
        });
    }, []);

    if (!isFilled.contentRelationship(project) || !project.data) {
        return <></>;
    }

    return (
        <Link
            href={`/projects/${project.uid}`}
            className="featured-project-card block h-full w-full opacity-0 outline-0 duration-[400ms]"
        >
            <div className="group relative h-full w-full items-end opacity-0 duration-[300ms] md:opacity-100 [.swiper-slide-active_&]:opacity-100">
                <div className={`pointer-events-none absolute top-0 left-0 z-[-1]`}>
                    <span
                        className={`
                            inline-block font-serif text-[clamp(400px,100vw,600px)] leading-none text-[#f2e4cf]
                            transition-transform duration-[400ms] md:text-[min(50vw,400px)]
                            translate-x-[0.2em] translate-y-[0.5em] 
                        `}
                    >
                        {no}
                    </span>
                </div>
                <div
                    className={`
                        relative z-1 flex flex-col items-center
                        h-full w-full gap-y-4 transition-transform duration-[400ms]
                    `}
                >
                    <div className="w-full h-[20%] flex flex-col items-start justify-end">
                        <h2 className="font-bold-h1 mb-2 font-flex text-[32px] leading-none text-black md:text-[3vw]">
                            {project.data.title || ''}
                        </h2>
                        <p className="text-md font-bold-h1 font-flex leading-none text-black md:text-[1vw]">
                            {project.data.leadingText}
                        </p>
                    </div>
                    {isFilled.linkToMedia(project.data.featuredMedia) && (
                        <div className="relative w-full h-[80%] object-cover aspect-auto drop-shadow-[10px_10px_10px_rgba(0,0,0,0.1)]">
                            <Image
                                alt={project.data.featuredMedia.name}
                                src={project.data.featuredMedia.url}
                                width={800}
                                height={600}
                                loading="eager"
                                priority={true}
                                className="h-full w-full object-contain object-top"
                                {...(project.data.featuredMedia.url.match(/.gif/) && {
                                    unoptimized: true,
                                })}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

type CarouselNavigationProps = {
    label: string;
    className: string;
};

const CarouselNavigation = forwardRef<HTMLButtonElement, CarouselNavigationProps>(function CarouselNavigation(
    { label, className },
    ref
) {
    return (
        <button
            className={`${className} font-arrow fixed -bottom-16 z-30 font-flex text-[20px] font-extrabold md:bottom-[3vh]`}
            ref={ref}
        >
            {label}
        </button>
    );
});

type ProjectCarouselProps = {
    featuredProjects: FeaturedProjects;
};

const ProjectCarousel = ({ featuredProjects }: ProjectCarouselProps) => {
    const prev = useRef<HTMLButtonElement>(null);
    const next = useRef<HTMLButtonElement>(null);
    const [, onSwiper] = useState<SwiperClass>();
    const [isWide, setWide] = useState(false);

    const [isLoaded, load] = useState(false);
    const theta = 9;
    const [r, setR] = useState(0);
    const [translateY, setY] = useState(0);

    useEffect(() => {
        let _r, _y;

        setWide(window.screen.width >= 768);
        _r = Math.max(400, Math.min(window.screen.width * 0.4, window.screen.height * 0.6));
        setR(_r);
        _y = (1 + Math.cos(theta)) * _r;
        setY(_y);
        load(true);

        const handleResize = () => {
            setWide(window.screen.width >= 768);
            _r = Math.max(400, Math.min(window.screen.width * 0.4, window.screen.height * 0.6));
            setR(_r);
            _y = (1 + Math.cos(theta)) * _r;
            setY(_y);
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <div
                className={`w-full h-full [--slide-width:100vw] md:[--slide-width:50vw] lg:[--slide-width:calc(100vw*0.35)]`}
            >
                {isLoaded && (
                    <Swiper
                        observer={true}
                        className="!overflow-visible h-full"
                        modules={[Navigation, A11y, EffectCreative, Mousewheel, FreeMode]}
                        effect={'creative'}
                        slidesPerView={isWide ? 3 : 1}
                        centeredSlides
                        mousewheel={true}
                        speed={isWide ? 550 : 300}
                        navigation={{
                            prevEl: prev.current,
                            nextEl: next.current,
                        }}
                        freeMode={false}
                        creativeEffect={{
                            limitProgress: 3,
                            prev: {
                                translate: [-r, translateY, 0],
                                rotate: [0, 0, -theta],
                                origin: 'center bottom',
                            },
                            next: {
                                translate: [r, translateY, 0],
                                rotate: [0, 0, theta],
                                origin: 'center bottom',
                            },
                        }}
                        loop={true}
                        onSwiper={onSwiper}
                    >
                        {featuredProjects.data.projects.slice(0, 9).map(
                            (item, i) =>
                                isFilled.contentRelationship(item.project) && (
                                    <SwiperSlide key={item.project.id} className={`!overflow-visible`}>
                                        <Project
                                            no={i + 1}
                                            length={featuredProjects.data.projects.length}
                                            project={item.project}
                                        />
                                    </SwiperSlide>
                                )
                        )}
                    </Swiper>
                )}
            </div>
            <div className="flex w-full justify-between md:contents xs:hidden">
                <CarouselNavigation label="← Prev." className="left-[4vw] -rotate-[9deg] md:left-[2vw]" ref={prev} />
                <CarouselNavigation label="Next →" className="right-[4vw] rotate-[9deg] md:right-[2vw]" ref={next} />
            </div>
        </div>
    );
};

type Props = {
    top: TopDocument;
    featuredProjects: FeaturedProjects;
    nav: NavigationDocument;
    settings: SettingsDocument;
};

const Index = ({ top, featuredProjects, nav, settings }: Props) => {
    const setFeaturedProjects = useSetAtom(FeaturedProjectsAtom);
    useEffect(() => {
        setFeaturedProjects(featuredProjects);
    }, [featuredProjects, setFeaturedProjects]);

    const [loaded, setLoad] = useState<boolean>(false);
    useEffect(() => {
        setLoad(true);
    }, []);

    return (
        <Layout nav={nav} className="flex flex-col overflow-hidden">
            <Head>
                <title>{settings.data.name?.[0]?.text || ''}</title>
            </Head>
            <main>
                <div className="z-50 grid fixed top-[5vh] left-[4vw] gap-4 md:gap-3">
                    <h1
                        className={`font-squash-h4 font-flex text-[9vw] leading-[0.9em] text-black md:text-[min(3vw,44px)]`}
                    >
                        <span
                            className={`inline-block delay-[200ms] duration-[800ms] ${
                                loaded ? 'translate-y-0 opacity-100' : 'translate-y-[0.5em] opacity-0'
                            }`}
                        >
                            {getTextFromField(top.data.title)}
                        </span>
                    </h1>
                    <p className="text-xs font-bold text-black">
                        <span
                            className={`inline-block delay-[350ms] duration-[800ms] ${
                                loaded ? 'translate-y-0 opacity-100' : 'translate-y-[0.5em] opacity-0'
                            }`}
                        >
                            {getTextFromField(top.data.comment)}
                        </span>
                    </p>
                </div>
                <div className="fixed top-[25vh] left-[50%] -translate-x-1/2 w-screen h-[70vh] px-[4vw] md:px-0">
                    <ProjectCarousel featuredProjects={featuredProjects} />
                </div>
            </main>
            <FooterNavigation nav={nav} />
        </Layout>
    );
};

export default Index;

export async function getStaticProps({ previewData }: { previewData?: unknown }) {
    const client = createClient({ previewData } as any);
    const top = (await client.getSingle('top')) as TopDocument;
    const featuredProjects: FeaturedProjects = await fetchFeaturedProjects(client);
    const nav = (await client.getSingle('navigation')) as NavigationDocument;
    const settings = (await client.getSingle('settings')) as SettingsDocument;

    return {
        props: {
            top,
            featuredProjects,
            nav,
            settings,
        },
    };
}
