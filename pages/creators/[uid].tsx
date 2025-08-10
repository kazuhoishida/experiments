import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import { PrismicLink, PrismicRichText, PrismicText, SliceZone } from '@prismicio/react';
import * as prismicH from '@prismicio/helpers';
import { createClient, linkResolver } from '../../prismicio';
import { components } from '../../slices';
import { Layout } from '../../components/Layout';
import { Bounded } from '../../components/Bounded';
import { ProjectDocument, CreatorDocument, NavigationDocument } from '../../prismic-models';
import { FeaturedProjectsAtom } from '../../stores';
import { type FeaturedProjects, fetchFeaturedProjects } from '../../fetches/featuredProject';
import { useSetAtom } from 'jotai';
import CreatorBubble from '../../components/CreatorBubble';
import FooterNavigation from '../../components/FooterNavigation';

type CreatorProps = {
    creator: CreatorDocument<string>;
    navigation: NavigationDocument<string>;
    featuredProjects: FeaturedProjects;
    projects: ProjectDocument[];
};

const Creator: NextPage<CreatorProps> = ({ creator, navigation, featuredProjects, projects }) => {
    const setFeaturedProjects = useSetAtom(FeaturedProjectsAtom);

    useEffect(() => {
        setFeaturedProjects(featuredProjects);
    }, [featuredProjects, setFeaturedProjects]);

    const github = prismicH.isFilled.link(creator.data.GitHub) && creator.data.GitHub;

    const [isWide, setWide] = useState(false);
    useEffect(() => {
        setWide(window.screen.width >= 768);

        const handleResize = () => {
            setWide(window.screen.width >= 768);
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Layout nav={navigation}>
            <Head>
                <title>{creator.data.name}</title>
            </Head>
            <main>
                <article className="pt-10">
                    <Bounded className="relative px-4 pb-0 md:mx-auto md:px-[10vw] md:pb-20 [&>div]:max-w-none md:[&>div]:flex md:[&>div]:gap-x-[4vw]">
                        {isWide && (
                            <div className="absolute top-0 left-0 z-10 h-full w-2/3">
                                <CreatorBubble />
                            </div>
                        )}
                        <div className="mb-8 h-full items-center gap-x-4 md:block md:w-1/2">
                            <h1 className="mb-3 font-serif text-[60px] font-semibold !leading-none [word-break:keep-all] md:text-[min(9vw,120px)] md:text-4xl">
                                {creator.data.name}
                            </h1>
                            <span className="aspect-square relative inline-block h-10 w-10 overflow-hidden rounded-full md:h-[4vw] md:w-[4vw]">
                                {creator.data?.face?.url && (
                                    <Image src={creator.data?.face?.url} alt={creator.data?.face?.alt ?? ''} fill />
                                )}
                            </span>
                        </div>
                        <div className="md:w-1/2 md:pt-10">
                            <div className="mb-8 flex gap-x-4 text-sm font-bold">
                                {github && (
                                    <PrismicLink
                                        field={github}
                                        className="flex h-6 w-24 place-content-center place-items-center rounded-md border border-v-red font-flex text-v-red md:hover:bg-v-red md:hover:text-white"
                                    >
                                        GitHub
                                    </PrismicLink>
                                )}
                                {creator.data.Contact && <p>{creator.data.Contact}</p>}
                            </div>
                            <div className="mt-4 mb-16 font-flex text-sm">
                                <PrismicRichText field={creator.data.Introduction} />
                            </div>
                        </div>
                    </Bounded>
                    {creator.data.slices.length > 0 && (
                        <div className="min-h-[calc(26vw+4rem)] bg-v-light-gray pt-10 pb-14 md:py-20">
                            <div className="px-4 md:mx-auto md:w-4/5 md:gap-x-20 lg:flex">
                                <div>
                                    <h2 className="font-squash-h4 font-flex text-[40px]">Works</h2>
                                    <p className="mb-8 font-flex text-[24px] font-bold">制作実績</p>
                                </div>
                                <div className="relative grid w-full gap-y-10">
                                    <SliceZone slices={creator.data.slices as any} components={components} />
                                </div>
                            </div>
                        </div>
                    )}
                </article>

                <div className="mt-8 mb-20 grid grid-cols-1 py-8 md:mb-20 md:grid-cols-4 md:items-end md:gap-x-10 md:px-[5vw] md:py-10">
                    {projects.slice(0, 8).map(
                        (project, index) =>
                            prismicH.isFilled.linkToMedia(project.data?.featuredMedia) && (
                                <PrismicLink
                                    field={prismicH.documentToLinkField(project)}
                                    key={project.id}
                                    className="group relative h-full border-black md:border-l"
                                >
                                    <div className="flex w-full shrink-0 flex-col gap-y-4 py-8 duration-[200ms] md:h-full md:justify-end md:pb-24 md:group-hover:-translate-y-3">
                                        <div className="px-4">
                                            <span className="absolute top-0 right-4 text-[48px] tracking-tighter text-white [-webkit-text-stroke:1px_black] md:-top-6 md:-right-6 md:text-[4vw]">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div className="font-bold-h1 mb-2 pt-16 font-flex text-[38px] font-extrabold leading-none">
                                                {project.data?.title}
                                            </div>
                                            <div className="text-md overflow-ellipsis font-flex leading-tight">
                                                {project.data?.leadingText}
                                            </div>
                                        </div>
                                        <Image
                                            src={project.data?.featuredMedia.url ?? ''}
                                            alt={project.data?.title ?? 'PROJECT'}
                                            fill
                                            className="!relative aspect-[5/3] !h-auto w-[90vw] object-cover shadow duration-[600ms] md:group-hover:shadow-lg"
                                        />
                                    </div>
                                </PrismicLink>
                            )
                    )}
                </div>
            </main>
            <FooterNavigation nav={navigation} />
        </Layout>
    );
};

export default Creator;

export const getStaticProps = async ({ params, previewData }: { params?: { uid?: string }; previewData?: unknown }) => {
    const client = createClient({ previewData } as any);

    const uid = params?.uid ?? '';
    const creator = await client.getByUID('creator', uid);
    const navigation = await client.getSingle('navigation');
    const featuredProjects: FeaturedProjects = await fetchFeaturedProjects(client);
    const allProjects = await client.getAllByType('project');

    const projects = allProjects.filter(project => {
        return project.data.creator.uid === creator.uid;
    });

    return {
        props: {
            creator,
            navigation,
            featuredProjects,
            projects,
        },
    };
};

export async function getStaticPaths() {
    const client = createClient();

    const creators = await client.getAllByType('creator');

    return {
        paths: creators.map(creator => prismicH.asLink(creator, linkResolver)),
        fallback: false,
    };
}
