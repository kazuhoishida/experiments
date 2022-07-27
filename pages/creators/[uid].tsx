import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import FutureImage from '../../next/ImgixImage'
import Head from "next/head"
import { PrismicLink, PrismicRichText, PrismicText, SliceZone } from "@prismicio/react"
import * as prismicH from "@prismicio/helpers"
import { createClient, linkResolver } from "../../prismicio"
import { components } from "../../slices"
import { Layout } from "../../components/Layout"
import { Bounded } from "../../components/Bounded"
import { ProjectDocument, CreatorDocument, NavigationDocument } from '../../prismic-models'
import { FeaturedProjectsAtom } from '../../stores'
import { type FeaturedProjects, fetchFeaturedProjects } from '../../fetches/featuredProject'
import { useUpdateAtom } from 'jotai/utils'
import CreatorBubble from '../../components/CreatorBubble'

type CreatorProps = {
  creator: CreatorDocument<string>
  navigation: NavigationDocument<string>
  featuredProjects: FeaturedProjects
  projects: ProjectDocument[]
}

const Creator: NextPage<CreatorProps> = ({ creator, navigation, featuredProjects, projects }) => {
  const setFeaturedProjects = useUpdateAtom(FeaturedProjectsAtom)
  setFeaturedProjects(featuredProjects)
  const github = prismicH.isFilled.link(creator.data.GitHub) && creator.data.GitHub

  const [isWide, setWide] = useState(false)
  useEffect(() => {
    setWide(window.screen.width >= 768)
    
    const handleResize = () => {
      setWide(window.screen.width >= 768)
    }
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return (
    <Layout nav={navigation} >
      <Head>
        <title>{creator.data.name}</title>
      </Head>
      <main>
        <article className='pt-10'>
          <Bounded className="relative pb-0 px-4 md:px-[10vw] [&>div]:max-w-none md:mx-auto md:[&>div]:flex md:[&>div]:gap-x-[4vw] md:pb-20">
            {isWide && (
              <div className='absolute top-0 left-0 w-2/3 h-full z-10 pointer-events-none'>
                <CreatorBubble />
              </div>
            )}
            <div className='mb-8 flex md:block gap-x-4 items-center md:w-1/2 h-full'>
              <h1 className="mb-3 font-serif text-[60px] md:text-[min(9vw,120px)] !leading-none font-semibold tracking-tighter md:text-4xl [word-break:keep-all]">
                {creator.data.name}
              </h1>
              {creator.data?.face?.url && (
                <FutureImage src={creator.data?.face?.url} alt={creator.data?.face?.alt ?? ''} className='w-10 md:w-[4vw] aspect-square rounded-full' />
              )}
            </div>
            <div className='md:w-1/2 md:pt-10'>
              <div className='flex gap-x-4 mb-8 font-bold text-sm'>
                {github && (
                  <PrismicLink field={github} className="font-flex rounded-md border text-v-red border-v-red w-20 flex place-items-center place-content-center md:hover:bg-v-red md:hover:text-white">GitHub</PrismicLink>
                )}
                {creator.data.Contact && <p>{creator.data.Contact}</p>}
              </div>
              <div className="font-flex text-sm mt-4 mb-16">
                <PrismicRichText field={creator.data.Introduction} />
              </div>
            </div>
          </Bounded>
          {creator.data.slices.length > 0 && (
            <div className='bg-v-light-gray py-10 md:py-20 min-h-[calc(26vw+4rem)]'>
              <div className='px-4 md:w-4/5 md:mx-auto md:flex md:gap-x-20'>
                <div>
                  <h2 className='font-flex font-squash-h4 text-[40px]'>Works</h2>
                  <p className='font-flex font-bold text-[24px] mb-8'>制作実績</p>
                </div>
                <div className='grid gap-y-10 w-full relative'>
                  <SliceZone slices={creator.data.slices} components={components} />
                </div>
              </div>
            </div>
          )}
        </article>

        <div className="grid grid-cols-1 md:grid-cols-4 md:items-end gap-y-16 py-8 mt-8 mb-20 md:mb-20 md:px-[5vw] md:py-10 md:gap-x-12">
          {projects.slice(0, 8).map((project, index) =>
            prismicH.isFilled.linkToMedia(project.data?.featuredMedia) && (
              <PrismicLink field={prismicH.documentToLinkField(project)} key={project.id}>
                <div className="flex flex-col shrink-0 gap-y-4 w-full md:border-l border-black py-20">
                  <div className='px-4 relative'>
                    <span className='absolute top-0 right-3 text-white tracking-tighter [-webkit-text-stroke:1px_black] text-[44px]'>{String(index + 1).padStart(2, '0')}</span>
                    <div className="pt-16 font-flex font-bold-h1 text-[40px] font-extrabold text-xl mb-2">{project.data?.title}</div>
                    <div className="font-flex text-md overflow-ellipsis">{project.data?.leadingText}</div>
                  </div>
                  <FutureImage
                    src={project.data?.featuredMedia.url ?? ''}
                    alt={project.data?.title ?? 'PROJECT'}
                    className="object-cover w-[90vw] aspect-[5/3]"
                  />
                </div>
              </PrismicLink>
            )
          )}
        </div>
      </main>
    </Layout>
  )
}

export default Creator

export const getStaticProps = async ({
  params,
  previewData
}: any) => {
  const client = createClient({ previewData })

  const uid = params?.uid ?? ''
  const creator = await client.getByUID("creator", uid)
  const navigation = await client.getSingle("navigation")
  const featuredProjects: FeaturedProjects = await fetchFeaturedProjects(client)
  const allProjects = await client.getAllByType('project')

  const projects = allProjects.filter((project) => {
    return project.data.creator.uid === creator.uid
  })

  return {
    props: {
      creator,
      navigation,
      featuredProjects,
      projects
    },
  }
}

export async function getStaticPaths() {
  const client = createClient()

  const creators = await client.getAllByType("creator")

  return {
    paths: creators.map((creator) => prismicH.asLink(creator, linkResolver)),
    fallback: false,
  }
}
