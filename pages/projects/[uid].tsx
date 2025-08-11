import { isFilled, asLink, asHTML } from '@prismicio/helpers';
import { createClient, linkResolver } from '../../prismicio';
import { FeaturedProjectsAtom } from '../../stores';
import { type FeaturedProjects, fetchFeaturedProjects } from '../../fetches/featuredProject';
import { Layout } from '../../components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSetAtom } from 'jotai';
import Image from 'next/image';
import Head from 'next/head';
import type { FilledLinkToMediaField } from '@prismicio/types';
import type { NextPage } from 'next';
import type { ProjectDocument, CreatorDocument } from '../../prismic-models';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import FooterNavigation from '../../components/FooterNavigation';
import HTML from '../../components/HTML';
import { toHTML } from '../../utils/prismic';

const Media = ({ field, isCoverImage = false }: { field: FilledLinkToMediaField; isCoverImage: boolean }) => {
    if (field.link_type !== 'Media') {
        return <></>;
    }
    if (field.kind === 'image') {
        return (
            <Image
                src={field.url}
                alt={field.name}
                fill
                loading={isCoverImage ? 'eager' : 'lazy'}
                className="h-full max-h-[30vh] w-full object-cover object-right md:max-h-[70vh] md:object-contain"
                {...(field.url.match(/.gif/) && { unoptimized: true })}
            />
        );
    } else {
        return <></>;
    }
};

const GoBackNav = () => {
    const router = useRouter();
    const back = () => router.back();
    return (
        <div className="flex place-content-center">
            <button className="group flex place-items-center gap-x-6" onClick={back}>
                <div className="grid grid-cols-3 gap-[2px]">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="h-[8px] w-[8px] bg-black duration-[400ms] group-hover:scale-0" />
                    ))}
                </div>
                <nav className="font-bold-h1 font-flex text-3xl font-[640] duration-[500ms] group-hover:-translate-x-4">
                    Go Back
                </nav>
            </button>
        </div>
    );
};

type ProjectProps = {
    project: ProjectDocument;
    creator: CreatorDocument;
    featuredProjects: FeaturedProjects;
};

const Project: NextPage<ProjectProps> = ({ project, creator, featuredProjects }) => {
    const setFeaturedProjects = useSetAtom(FeaturedProjectsAtom);
    useEffect(() => {
        setFeaturedProjects(featuredProjects);
    }, [featuredProjects, setFeaturedProjects]);

    const featuredMedia = isFilled.linkToMedia(project.data.featuredMedia) ? project.data.featuredMedia : null;
    const demo = isFilled.link(project.data.demoLink) && project.data.demoLink;
    const github = isFilled.link(project.data.github) && project.data.github;

    const router = useRouter();
    useEffect(() => {
        router.prefetch('/projects');
    }, [router]);

    const [isShowText, setIsShowText] = useState(false);

    const { ref, inView } = useInView({
        rootMargin: '-50px',
    });

    return (
        <Layout>
            <Head>
                <title>{project.data.title}</title>
            </Head>
            <main>
                <article className="mb-12 md:mt-10">
                    <div className="relative aspect-[5/3] md:hidden">
                        {featuredMedia && <Media field={featuredMedia} isCoverImage={true} />}
                    </div>
                    <div className="px-4 md:px-0 md:w-[90vw] mx-auto">
                        <h1 className="pt-6 pb-3 font-serif text-3xl font-bold md:flex md:p-0 md:text-[min(7vw,60px)] md:leading-none md:mb-10">
                            {project.data.title}
                        </h1>
                        <div className="md:flex">
                            <div className="md:w-2/5 md:pr-10">
                                <div className="flex gap-x-6 py-6 empty:!py-0">
                                    {demo && (
                                        <Link
                                            href={asLink(demo, linkResolver) || '#'}
                                            className="flex w-20 place-content-center place-items-center rounded-md border border-v-red font-flex text-v-red md:w-28 md:py-1 md:hover:bg-v-red md:hover:text-white"
                                        >
                                            DEMO
                                        </Link>
                                    )}
                                    {github && (
                                        <Link
                                            href={asLink(github, linkResolver) || '#'}
                                            className="flex w-20 place-content-center place-items-center rounded-md border border-black font-flex md:w-28 md:py-1 md:hover:bg-black md:hover:text-white"
                                        >
                                            GitHub
                                        </Link>
                                    )}
                                </div>
                                {project.data.abstract.length > 0 && (
                                    <div className="mt-4 font-flex text-sm">
                                        <HTML className="prose prose-sm" html={toHTML(project.data.abstract)} />
                                    </div>
                                )}
                            </div>
                            <div className="relative hidden aspect-[5/3] md:block md:w-3/5">
                                {featuredMedia && <Media field={featuredMedia} isCoverImage={true} />}
                            </div>
                        </div>

                        <div className="mx-auto md:mt-28 md:mb-32 md:flex md:w-[90vw] md:flex-row-reverse">
                            {project.data.details[0] && (
                                <div className="md:w-1/2">
                                    <div
                                        className={`transform-all flex flex-col break-words transition-opacity duration-[200ms] md:!h-auto md:transform-none md:!opacity-100 ${
                                            isShowText
                                                ? 'visible my-8 opacity-100'
                                                : 'h-0 opacity-0 md:!m-0 md:!block md:!pl-[5vw]'
                                        }`}
                                    >
                                        {project.data.details.map(({ title, description }, index) => (
                                            <div key={`detail-${index}`} className="[&>h2]:!mb-2 [&>h2]:text-[20px]">
                                                <h2 className="font-bold-h2">{title}</h2>
                                                <HTML className="prose prose-sm" html={toHTML(description)} />
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        className={`my-4 flex place-content-center py-4 duration-[200ms] md:hidden ${
                                            isShowText ? 'rotate-180' : 'rotate-0'
                                        }`}
                                        onClick={() => setIsShowText(!isShowText)}
                                    >
                                        <span
                                            className={`
                                            font-squash-h1 relative font-flex text-[12px] font-[800]
                                            before:absolute before:top-[180%] before:left-1/2 before:h-px before:w-3/5 before:origin-right before:-translate-x-full before:rotate-[20deg] before:bg-black
                                            after:absolute after:top-[180%] after:left-1/2 after:h-px after:w-3/5 after:origin-left after:-rotate-[20deg] after:bg-black
                                            `}
                                        >
                                            {isShowText ? `CLOSE` : `VIEW MORE`}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="mt-12 md:mt-0 md:w-1/2 [&_section]:mb-6 md:[&_section]:mb-10 last:[&_*]:mb-0 [&_iframe]:h-auto [&_iframe]:w-full">
                                {project.data.slices &&
                                    project.data.slices.map((slice, index) => {
                                        if (slice.slice_type === 'rich_text') {
                                            const richText = slice.primary?.rich_text;
                                            if (!richText) return null;

                                            return (
                                                <HTML
                                                    key={`slice-${index}`}
                                                    className="prose prose-sm mb-6"
                                                    html={richText || ''}
                                                />
                                            );
                                        }

                                        if (slice.slice_type === 'image') {
                                            const image = slice.primary?.image;
                                            if (!image || !isFilled.linkToMedia(image)) return null;

                                            return (
                                                <div key={`slice-${index}`} className="mb-6">
                                                    <div className="relative aspect-[5/3] w-full">
                                                        <Image
                                                            src={image.url}
                                                            alt={image.name || ''}
                                                            fill
                                                            className="object-cover"
                                                            {...(image.url.match(/.gif/) && { unoptimized: true })}
                                                        />
                                                    </div>
                                                    {slice.primary.caption && slice.primary.caption.length > 0 && (
                                                        <HTML
                                                            className="mt-2 text-sm text-gray-600 text-center"
                                                            html={toHTML(slice.primary.caption)}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        }

                                        return null;
                                    })}
                            </div>
                        </div>
                    </div>
                    <FooterNavigation />
                </article>
                <GoBackNav />

                <div
                    className="no-scrollbar mt-16 mb-16 flex flex-nowrap gap-x-4 overflow-x-scroll bg-v-light-gray py-8 md:mb-20 md:gap-x-12 md:pt-28 md:pb-20"
                    ref={ref}
                >
                    {featuredProjects.data.projects.map(item => {
                        const rel = item.project;
                        if (!isFilled.contentRelationship(rel) || !rel.data) return null;
                        const project = rel as unknown as ProjectDocument;
                        if (!isFilled.linkToMedia(project.data.featuredMedia)) return null;
                        return (
                            <Link
                                href={asLink(project, linkResolver) || '#'}
                                key={project.id}
                                className="duration-[400ms] first:pl-4 last:pr-4 md:first:pl-4 md:last:pr-4 md:hover:opacity-60"
                            >
                                <div className="flex w-[50vw] shrink-0 flex-col md:w-[30vw]">
                                    <Image
                                        src={project.data?.featuredMedia.url ?? ''}
                                        alt={project.data?.title ?? 'PROJECT'}
                                        fill
                                        className="!relative mb-2 aspect-[5/3] w-full object-cover"
                                    />
                                    <div className="text-md font-bold-h6 overflow-ellipsis font-flex font-extrabold md:text-xl">
                                        {project.data?.title}
                                    </div>
                                    <div className="overflow-ellipsis font-flex text-xs md:text-sm">
                                        {project.data?.leadingText}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>
        </Layout>
    );
};

export default Project;

export const getStaticProps = async ({ params, previewData }: any) => {
    const client = createClient({ previewData });

    const uid = params?.uid ?? '';
    if (uid === '') {
        return {
            notFound: true,
        };
    }
    const project = (await client.getByUID('project', uid, {
        fetchLinks: ['creator.name', 'creator.face'],
    })) as ProjectDocument;
    const creator = project.data.creator;
    if (!isFilled.contentRelationship(creator)) {
        return {
            notFound: true,
        };
    }
    const featuredProjects: FeaturedProjects = await fetchFeaturedProjects(client);

    return {
        props: {
            project,
            creator,
            featuredProjects,
        },
    };
};

export async function getStaticPaths() {
    const client = createClient();

    const projects = await client.getAllByType('project');

    return {
        paths: projects.map(project => asLink(project, linkResolver)),
        fallback: false,
    };
}
