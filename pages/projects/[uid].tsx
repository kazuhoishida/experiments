import { asDate, isFilled, asLink } from '@prismicio/helpers'
import { asText } from '@prismicio/richtext'
import { components } from "../../slices"
import { createClient, linkResolver } from "../../prismicio"
import { FeaturedProjectsAtom } from '../../stores'
import { type FeaturedProjects, fetchFeaturedProjects } from '../../fetches/featuredProject'
import { Layout } from "../../components/Layout"
import { PrismicLink, PrismicRichText, PrismicText, SliceZone } from "@prismicio/react"
import { useRouter } from 'next/router'
import { useUpdateAtom } from 'jotai/utils'
import FutureImage from '../../next/ImgixImage'
import Head from "next/head"
import type { FilledLinkToMediaField, } from '@prismicio/types'
import type { NextPage } from 'next'
import type { ProjectDocument, CreatorDocument, NavigationDocument } from '../../prismic-models'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import ArrowIcon from '../../components/ArrowIcon'

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

const Media = ({field, isCoverImage = false}: {field: FilledLinkToMediaField, isCoverImage: boolean}) => {
  if( field.link_type !== 'Media' ) {
    return <></>
  }
  if( field.kind === 'image' ) {
    return (
      <div className="relative w-full">
        <FutureImage src={field.url} alt={field.name} loading={isCoverImage ? 'eager' : 'lazy'} className="w-full max-h-[30vh] object-cover md:object-contain md:max-h-[70vh] object-right" />
      </div>
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
      <button className="flex place-items-center gap-x-6 group" onClick={back}>
        <div className="grid gap-[2px] grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-[8px] h-[8px] bg-black group-hover:scale-0 duration-[400ms]" />
          ))}
        </div>
        <nav className="font-flex font-bold-h1 font-[640] text-3xl group-hover:-translate-x-4 duration-[500ms]">Go Back</nav>
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

const Project: NextPage<ProjectProps> = ({ project, creator, nav, featuredProjects, }) => {
  const setFeaturedProjects = useUpdateAtom(FeaturedProjectsAtom)
  setFeaturedProjects(featuredProjects)
  const date = asDate(
    project.data.publishDate || project.first_publication_date as any
  )
  const featuredMedia = isFilled.linkToMedia(project.data.featuredMedia) ? project.data.featuredMedia : null
  const face = creator.data?.face?.url ?? null
  const demo = isFilled.link(project.data.demoLink) && project.data.demoLink
  const github = isFilled.link(project.data.github) && project.data.github
  
  const router = useRouter()
  useEffect(() => {
    router.prefetch('/projects')
  })

  const [isShowText, setIsShowText] = useState(false)

  const { ref, inView } = useInView({
    rootMargin: '-50px'
  });
  
  return (
    <Layout nav={nav} >
      <Head>
        <title>{project.data.title}</title>
      </Head>
      <main>
        <article className='mb-12 md:mt-10'>
          <div className='relative md:hidden'>
            {featuredMedia && <Media field={featuredMedia} isCoverImage={true} />}
          </div>
          <div className='px-4 md:px-0'>
            <div className="md:px-[5vw] md:mb-[max(10vh,30px)] md:flex">
              <h1 className="text-3xl md:text-[7vw] font-serif font-bold pt-6 pb-3 md:p-0 md:leading-none md:flex
              md:after:content-[''] md:after:w-[1px] md:after:h-full md:after:inline-block md:after:bg-black md:after:rotate-[30deg] md:after:mx-[4vw]">
                {project.data.title}
              </h1>
              <div className="flex gap-x-4 place-items-center">
                {face && (
                  <PrismicLink className="flex place-items-center gap-x-2 font-flex font-[640] [font-stretch:32%]" document={creator}>
                    <FutureImage className="rounded-full w-12 h-12 aspect-1" src={face} alt={(creator.data?.face?.alt || creator.data.name) ?? 'CREATOR'}/>
                  </PrismicLink>
                )}
                <div className="flex flex-col">
                  <PrismicLink className="flex place-items-center gap-x-2 font-flex font-[640] [font-stretch:32%]" document={creator}>
                    {creator.data.name}
                  </PrismicLink>
                  <p className="font-flex font-[640] [font-stretch:32%]">
                    {dateFormatter.format(date!)}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map(tag => (
                      <div key={tag} className="font-flex font-[640] [font-stretch:32%] text-sm text-black/50">{`#${tag}`}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className='md:flex'>
              <div className='md:w-2/5 md:pl-[5vw] md:pr-10'>
                <div className="flex gap-x-6 py-6 empty:!py-0">
                  {demo && (
                    <PrismicLink field={demo} className="font-flex text-v-red rounded-md border border-v-red w-20 md:w-28 md:py-1 flex place-items-center place-content-center md:hover:bg-v-red md:hover:text-white">DEMO</PrismicLink>
                  )}
                  {github && (
                    <PrismicLink field={github} className="font-flex rounded-md border border-black w-20 md:w-28 md:py-1 flex place-items-center place-content-center md:hover:bg-black md:hover:text-white">GitHub</PrismicLink>
                  )}
                </div>
                <div className="font-flex text-sm mt-4">
                  <PrismicRichText field={project.data.abstract} />
                </div>
              </div>
              <div className='hidden md:block md:w-3/5'>
                {featuredMedia && <Media field={featuredMedia} isCoverImage={true} />}
              </div>
            </div>

            <div className='md:flex md:flex-row-reverse md:mt-28 md:mb-32 md:w-[90vw] mx-auto'>
              {project.data.details[0] && (
                <div className='md:w-1/2'>
                  <div className={`flex flex-col break-words transition-opacity md:!opacity-100 md:!h-auto transform-all md:transform-none duration-[200ms] ${isShowText ? 'visible my-8 opacity-100' : 'h-0 opacity-0 md:!block md:!m-0 md:!pl-[5vw]'}`}>
                    {project.data.details.map(({title, description}) => (
                      <div key={asText(title)} className="[&>h2]:text-[20px] [&>h2]:!mb-2 [&>p]:text-[14px]">
                        <PrismicRichText field={title} />
                        <PrismicRichText field={description} />
                      </div>
                    ))}
                  </div>
                  <div className={`flex place-content-center py-4 my-4 md:hidden duration-[200ms] ${isShowText ? 'rotate-180' : 'rotate-0'}`} onClick={() => setIsShowText(!isShowText)}>
                    <span className={`
                      relative font-flex font-squash-h1 font-[800] text-[12px]
                      before:absolute before:w-3/5 before:h-px before:rotate-[20deg] before:origin-right before:bg-black before:-translate-x-full before:top-[180%] before:left-1/2
                      after:absolute after:w-3/5 after:h-px after:-rotate-[20deg] after:origin-left after:bg-black after:top-[180%] after:left-1/2
                    `}>{isShowText ? `CLOSE` : `VIEW MORE`}</span>
                  </div>
                </div>
              )}
              <div className='mt-12 md:w-1/2 md:mt-0 [&_*]:mb-6 md:[&_*]:mb-10 last:[&_*]:mb-0 [&_iframe]:w-full [&_iframe]:h-auto'>
                <SliceZone slices={project.data.slices} components={components} />
              </div>
            </div>
          </div>
          {demo && (
            <PrismicLink
              field={demo}
              className={`fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/70 drop-shadow rounded-lg flex place-content-center items-center gap-x-2 backdrop-blur-sm px-12 py-2 md:px-16 md:py-3 whitespace-nowrap md:hover:bg-black/100 transition-all duration-[400ms] group ${inView ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <span className="font-flex text-sm text-white">デモを見る</span>
              <span className='[&>svg]:w-[9px] [&>svg]:fill-white md:group-hover:translate-x-[2px] md:group-hover:-translate-y-[2px] duration-[200ms]'><ArrowIcon /></span>
            </PrismicLink>
          )}
        </article>
        <GoBackNav />
        
        <div className="flex flex-nowrap gap-x-4 overflow-x-scroll bg-v-light-gray py-8 mt-16 mb-16 md:mb-20 md:pt-28 md:pb-20 md:gap-x-12 no-scrollbar" ref={ref}>
          {featuredProjects.data.projects.map(({project}) =>
            isFilled.contentRelationship(project) && isFilled.linkToMedia(project.data?.featuredMedia) && (
              <PrismicLink field={project} key={project.id} className='md:hover:opacity-60 duration-[400ms] first:pl-4 md:first:pl-[5vw] last:pr-4 md:last:pr-[5vw]'>
                <div className="flex flex-col shrink-0 w-[50vw] md:w-[30vw]">
                  <FutureImage
                    src={project.data?.featuredMedia.url ?? ''}
                    alt={project.data?.title ?? 'PROJECT'}
                    className="object-cover w-full aspect-[5/3] mb-2"
                  />
                  <div className="font-flex font-bold-h6 font-extrabold text-md md:text-xl overflow-ellipsis">{project.data?.title}</div>
                  <div className="font-flex text-xs overflow-ellipsis">{project.data?.leadingText}</div>
                </div>
              </PrismicLink>
          ))}
        </div>
      </main>
    </Layout>
  )
}

export default Project

export const getStaticProps = async ({
  params,
  previewData
}: any) => {
  const client = createClient({ previewData })

  const uid = params?.uid ?? ''
  if( uid === '' ) {
    return {
      notFound: true
    }
  }
  const project = await client.getByUID<ProjectDocument>('project', uid, {
    fetchLinks: ['creator.name', 'creator.face']
  })
  const creator = project.data.creator
  if( !isFilled.contentRelationship(creator) ) {
    return {
      notFound: true
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
