import { asDate, isFilled, asLink } from '@prismicio/helpers'
import { asText } from '@prismicio/richtext'
import { components } from '../../slices'
import { createClient, linkResolver } from '../../prismicio'
import { FeaturedProjectsAtom } from '../../stores'
import {
  type FeaturedProjects,
  fetchFeaturedProjects,
} from '../../fetches/featuredProject'
import { Layout } from '../../components/Layout'
import {
  PrismicLink,
  PrismicRichText,
  PrismicText,
  SliceZone,
} from '@prismicio/react'
import { useRouter } from 'next/router'
import { useSetAtom } from 'jotai'
import Image from 'next/image'
import Head from 'next/head'
import type { FilledLinkToMediaField } from '@prismicio/types'
import type { NextPage } from 'next'
import type {
  ProjectDocument,
  CreatorDocument,
  NavigationDocument,
} from '../../prismic-models'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import ArrowIcon from '../../components/ArrowIcon'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const Media = ({
  field,
  isCoverImage = false,
}: {
  field: FilledLinkToMediaField
  isCoverImage: boolean
}) => {
  console.log(field.url)
  if (field.link_type !== 'Media') {
    return <></>
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
    )
  } else {
    return <>not image</>
  }
}

const GoBackNav = () => {
  const router = useRouter()
  const back = () => router.back()
  return (
    <div className="flex place-content-center">
      <button className="group flex place-items-center gap-x-6" onClick={back}>
        <div className="grid grid-cols-3 gap-[2px]">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-[8px] w-[8px] bg-black duration-[400ms] group-hover:scale-0"
            />
          ))}
        </div>
        <nav className="font-bold-h1 font-flex text-3xl font-[640] duration-[500ms] group-hover:-translate-x-4">
          Go Back
        </nav>
      </button>
    </div>
  )
}

type ProjectProps = {
  project: ProjectDocument
  creator: CreatorDocument
  nav: NavigationDocument
  featuredProjects: FeaturedProjects
}

const Project: NextPage<ProjectProps> = ({
  project,
  creator,
  nav,
  featuredProjects,
}) => {
  const setFeaturedProjects = useSetAtom(FeaturedProjectsAtom)
  setFeaturedProjects(featuredProjects)
  const date = asDate(
    project.data.publishDate || (project.first_publication_date as any)
  )
  const featuredMedia = isFilled.linkToMedia(project.data.featuredMedia)
    ? project.data.featuredMedia
    : null
  const face = creator.data?.face?.url ?? null
  const demo = isFilled.link(project.data.demoLink) && project.data.demoLink
  const github = isFilled.link(project.data.github) && project.data.github

  const router = useRouter()
  useEffect(() => {
    router.prefetch('/projects')
  })

  const [isShowText, setIsShowText] = useState(false)

  const { ref, inView } = useInView({
    rootMargin: '-50px',
  })

  return (
    <Layout nav={nav}>
      <Head>
        <title>{project.data.title}</title>
      </Head>
      <main>
        <article className="mb-12 md:mt-10">
          <div className="relative aspect-[5/3] md:hidden">
            {featuredMedia && (
              <Media field={featuredMedia} isCoverImage={true} />
            )}
          </div>
          <div className="px-4 md:px-0">
            <div className="md:mb-[max(10vh,30px)] md:flex md:px-[5vw]">
              <h1
                className="pt-6 pb-3 font-serif text-3xl font-bold md:flex md:p-0 md:text-[7vw] md:leading-none
              md:after:mx-[4vw] md:after:inline-block md:after:h-full md:after:w-[1px] md:after:rotate-[30deg] md:after:bg-black md:after:content-['']"
              >
                {project.data.title}
              </h1>
              <div className="flex place-items-center gap-x-4">
                {face && (
                  <PrismicLink
                    className="relative flex aspect-1 h-12 w-12 place-items-center gap-x-2 font-flex font-[640] [font-stretch:32%]"
                    document={creator}
                  >
                    <Image
                      className="rounded-full"
                      src={face}
                      alt={
                        (creator.data?.face?.alt || creator.data.name) ??
                        'CREATOR'
                      }
                      fill
                    />
                  </PrismicLink>
                )}
                <div className="flex flex-col">
                  <PrismicLink
                    className="flex place-items-center gap-x-2 whitespace-nowrap font-flex font-[640] [font-stretch:32%]"
                    document={creator}
                  >
                    {creator.data.name}
                  </PrismicLink>
                  <p className="whitespace-nowrap font-flex font-[640] [font-stretch:32%]">
                    {dateFormatter.format(date!)}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <div
                        key={tag}
                        className="font-flex text-sm font-[640] text-black/50 [font-stretch:32%]"
                      >{`#${tag}`}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="md:flex">
              <div className="md:w-2/5 md:pl-[5vw] md:pr-10">
                <div className="flex gap-x-6 py-6 empty:!py-0">
                  {demo && (
                    <PrismicLink
                      field={demo}
                      className="flex w-20 place-content-center place-items-center rounded-md border border-v-red font-flex text-v-red md:w-28 md:py-1 md:hover:bg-v-red md:hover:text-white"
                    >
                      DEMO
                    </PrismicLink>
                  )}
                  {github && (
                    <PrismicLink
                      field={github}
                      className="flex w-20 place-content-center place-items-center rounded-md border border-black font-flex md:w-28 md:py-1 md:hover:bg-black md:hover:text-white"
                    >
                      GitHub
                    </PrismicLink>
                  )}
                </div>
                <div className="mt-4 font-flex text-sm">
                  <PrismicRichText field={project.data.abstract} />
                </div>
              </div>
              <div className="relative hidden aspect-[5/3] md:block md:w-3/5">
                {featuredMedia && (
                  <Media field={featuredMedia} isCoverImage={true} />
                )}
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
                    {project.data.details.map(({ title, description }) => (
                      <div
                        key={asText(title)}
                        className="[&>h2]:!mb-2 [&>h2]:text-[20px]"
                      >
                        <PrismicRichText field={title} />
                        <PrismicRichText field={description} />
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
                <SliceZone
                  slices={project.data.slices as any}
                  components={components}
                />
              </div>
            </div>
          </div>
          {demo && (
            <PrismicLink
              field={demo}
              className={`group fixed bottom-4 left-1/2 flex -translate-x-1/2 place-content-center items-center gap-x-2 whitespace-nowrap rounded-lg bg-black/70 px-12 py-2 drop-shadow backdrop-blur-sm transition-all duration-[400ms] md:px-16 md:py-3 md:hover:bg-black/100 ${
                inView ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
            >
              <span className="font-flex text-sm text-white">デモを見る</span>
              <span className="duration-[200ms] md:group-hover:translate-x-[2px] md:group-hover:-translate-y-[2px] [&>svg]:w-[9px] [&>svg]:fill-white">
                <ArrowIcon />
              </span>
            </PrismicLink>
          )}
        </article>
        <GoBackNav />

        <div
          className="no-scrollbar mt-16 mb-16 flex flex-nowrap gap-x-4 overflow-x-scroll bg-v-light-gray py-8 md:mb-20 md:gap-x-12 md:pt-28 md:pb-20"
          ref={ref}
        >
          {featuredProjects.data.projects.map((item) => {
            const project = item.project as ProjectDocument
            return (
              isFilled.contentRelationship(project as any) &&
              isFilled.linkToMedia(project.data.featuredMedia) && (
                <PrismicLink
                  field={project}
                  key={project.id}
                  className="duration-[400ms] first:pl-4 last:pr-4 md:first:pl-[5vw] md:last:pr-[5vw] md:hover:opacity-60"
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
                </PrismicLink>
              )
            )
          })}
        </div>
      </main>
    </Layout>
  )
}

export default Project

export const getStaticProps = async ({ params, previewData }: any) => {
  const client = createClient({ previewData })

  const uid = params?.uid ?? ''
  if (uid === '') {
    return {
      notFound: true,
    }
  }
  const project = await client.getByUID<ProjectDocument>('project', uid, {
    fetchLinks: ['creator.name', 'creator.face'],
  })
  const creator = project.data.creator
  if (!isFilled.contentRelationship(creator)) {
    return {
      notFound: true,
    }
  }
  const featuredProjects: FeaturedProjects = await fetchFeaturedProjects(client)
  const nav = await client.getSingle<NavigationDocument>('navigation')

  return {
    props: {
      project,
      creator,
      nav,
      featuredProjects,
    },
  }
}

export async function getStaticPaths() {
  const client = createClient()

  const projects = await client.getAllByType('project')

  return {
    paths: projects.map((project) => asLink(project, linkResolver)),
    fallback: false,
  }
}
