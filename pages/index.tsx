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

    const setLoadingEager = (num: number) => {
        return num === 1 || num === 2 || num === length;
    };

    if (!isFilled.contentRelationship(project) || !project.data) {
        return <></>;
    }

    return (
        <Link
            href={`/projects/${project.uid}`}
            className="featured-project-card block opacity-0 outline-0 duration-[400ms]"
        >
            <div className="group grid w-full items-end opacity-0 duration-[300ms] md:w-[var(--slide-width)] md:pt-0 md:opacity-100 [.swiper-slide-active_&]:opacity-100">
                <div
                    className={`
                        pointer-events-none relative col-start-1 col-end-3 row-start-1
                        inline-grid translate-x-[-73.5%] md:translate-x-[-80%]
                        z-[-1]
                    `}
                >
                    <span
                        className={`
                            inline-block translate-x-[78%] font-serif text-[clamp(400px,100vw,600px)] leading-[0.9] text-[#f2e4cf]
                            transition-transform duration-[400ms] md:text-[50vw] [.swiper-slide-active_&]:translate-x-[70%] md:[.swiper-slide-active_&]:translate-x-[60%]
                        `}
                    >
                        {no}
                    </span>
                </div>
                <div
                    className={`
                        relative z-[1] col-start-2 col-end-3 row-start-1 flex
                        max-h-[80vh] w-[68vw] translate-y-[-4%] flex-col place-content-end gap-y-4 justify-self-end transition-transform
                        duration-[400ms] md:w-[calc(var(--slide-width)*0.8)] md:translate-y-[-10%]
                        md:gap-y-8
                        md:group-hover:translate-y-[-12%]
                    `}
                >
                    <div className="pl-[8%]">
                        <h2 className="font-bold-h1 mb-2 font-flex text-[32px] leading-none text-black md:text-[3vw]">
                            {project.data.title || ''}
                        </h2>
                        <p className="text-md font-bold-h1 font-flex leading-none text-black md:text-[1vw]">
                            {project.data.leadingText}
                        </p>
                    </div>
                    {isFilled.linkToMedia(project.data.featuredMedia) && (
                        <div className="duratino-[400ms] relative aspect-[4/3] w-full border-l-transparent shadow transition-shadow md:group-hover:shadow-md">
                            <Image
                                alt={project.data.featuredMedia.name}
                                src={project.data.featuredMedia.url}
                                fill
                                loading={setLoadingEager(no) ? 'eager' : 'lazy'}
                                priority={setLoadingEager(no)}
                                className="h-full w-full object-cover"
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
    const [swiper, onSwiper] = useState<SwiperClass>();
    const [isWide, setWide] = useState(false);

    const [isLoaded, load] = useState(false);
    const theta = 9;
    const [r, setR] = useState(0);
    const [translateY, setY] = useState(0);

    useEffect(() => {
        let _r, _y;

        setWide(window.screen.width >= 768);
        _r = Math.max(400, window.screen.width * 0.4);
        setR(_r);
        _y = (1 + Math.cos(theta)) * _r;
        setY(_y);
        load(true);

        const handleResize = () => {
            setWide(window.screen.width >= 768);
            _r = Math.max(400, window.screen.width * 0.4);
            setR(_r);
            _y = (1 + Math.cos(theta)) * _r;
            setY(_y);
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div
                className={`
        translate-y-[calc(var(--slide-width)*0.015)] [--slide-width:100vw] md:translate-x-[calc(var(--slide-width)*0.24)]
        md:translate-y-[calc(var(--slide-width)*0.05)] md:[--slide-width:50vw] lg:[--slide-width:calc(100vw*0.35)]
      `}
            >
                {isLoaded && (
                    <Swiper
                        observer={true}
                        className="!overflow-visible"
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
        </>
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
                <div className="fixed top-[45%] w-screen -translate-y-1/2 px-[4vw] md:top-1/2 md:left-4 md:px-0">
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
