import Head from "next/head"
import Image from "next/image"
import { useRef, forwardRef, useState, useEffect } from "react"
import { asText, isFilled } from "@prismicio/helpers"
import type { FeaturedProjectsDocumentWithLinks, ProjectWithFetched, FetchKeyUnion } from "../prismic-additional"
import type { NavigationDocument, SettingsDocument, TopDocument } from "../prismic-models"

import { createClient } from "../prismicio"
import { Layout } from "../components/Layout"

import { Navigation, A11y, EffectCreative } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-creative'

// fetchLinksに指定するフィールド名
const projectFetchKeys = ['title', 'featuredMedia', 'abstract'] as const
type TProjectFetchKey = FetchKeyUnion<typeof projectFetchKeys>

type ProjectProps = {
  no: number
  project: ProjectWithFetched<TProjectFetchKey>
  leadingText: string
}
const Project = ({ no, project, leadingText }: ProjectProps) => {
  if( !isFilled.contentRelationship(project) || !project.data) {
    return <></>
  }
  return (
    <div className="grid bg-white md:max-w-[calc(clamp(768px,100vw,1600px)/3)]">
      <span className={`
        relative col-start-1 col-end-3 row-start-1
        font-serif text-[clamp(400px,100vw,600px)] text-black leading-none translate-x-[-8%]
      `}
      >{no}</span>
      <div className="relative max-w-[clamp(300px,calc(1600px/3),60vw)] max-h-[80vh] justify-self-end flex flex-col place-content-center col-start-2 col-end-3 row-start-1 bg-white border-l border-l-black">
        <div className="pl-[8%]">
          <h2 className="font-flex font-bold-h1 text-[33.5053px] text-black leading-none overflow-clip">
            {project.data.title}
          </h2>
          <p className="font-flex font-bold-h1 text-[18.8513px] text-black">
            {leadingText}
          </p>
        </div>
        {
          isFilled.linkToMedia(project.data.featuredMedia) && (
            <div className="w-full h-full relative">
              <Image className="border border-[#D2D2D2]" alt={project.data.featuredMedia.name} src={project.data.featuredMedia.url} layout="fill" objectFit="contain" />
            </div>
          )
        }
      </div>
    </div>
  )
}

type CarouseNavigationProps = {
  label: string
  className: string
}

const CarouseNavigation = forwardRef<HTMLButtonElement, CarouseNavigationProps>(
  function CarouseNavigation({ label, className }, ref) { // ここで関数名を付けないとeslintに引っかかる
    return (
      <button className={`${className}`} ref={ref}>{label}</button>
    )
  }
)

type ProjectCarouselProps = {
  featuredProjects: FeaturedProjectsDocumentWithLinks<TProjectFetchKey>
}

const ProjectCarousel = ({ featuredProjects }: ProjectCarouselProps) => {
  const prev = useRef<HTMLButtonElement>(null)
  const next = useRef<HTMLButtonElement>(null)
  const [isWide, setWide] = useState(false)
  useEffect(() => {
    setWide(window.screen.width >= 768)
  }, [])
  return (
    <div className="max-h-[100vh]">
      <Swiper
        modules={[Navigation, A11y, EffectCreative]}
        effect={"creative"}
        spaceBetween={50}
        slidesPerView={isWide ? 3 : 1}
        centeredSlides
        navigation={{
          prevEl: prev.current,
          nextEl: next.current,
        }}
        creativeEffect={{
          prev: {
            translate: [-400, 0, 0],
            rotate: [0, 0, -45],
            origin: 'center bottom'
          },
          next: {
            translate: [400, 0, 0],
            rotate: [0, 0, 45],
            origin: 'center bottom'
          },
        }}
        loop={true}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
      >
        {featuredProjects.data.projects.map((item, i) => {
          if(!isFilled.contentRelationship(item.project)) {
            return
          }
          const project = item.project
          const leadingText = item.leadingText ?? ''
          return (
            <SwiperSlide key={i}>
              <Project no={i+1} project={project} leadingText={leadingText} />
            </SwiperSlide>
          )
        })}
      </Swiper>
      <CarouseNavigation label="← Prev" className="fixed z-50 bottom-[8%] left-[8%]" ref={prev} />
      <CarouseNavigation label="Next →" className="fixed z-50 bottom-[8%] right-[8%]" ref={next} />
    </div>
  )
}

type Props = {
  top: TopDocument
  featuredProjects: FeaturedProjectsDocumentWithLinks<TProjectFetchKey>
  navigation: NavigationDocument<string>
  settings: SettingsDocument<string>
}

const Index = ({top, featuredProjects, navigation, settings }: Props) => {
  return (
    <Layout nav={navigation} >
      <Head>
        <title>{asText(settings.data.name)}</title>
      </Head>
      <div className="px-[8%] md:px-0">
        <h1 className="font-flex font-squash-h4 text-4xl text-black">{asText(top.data.title)}</h1>
        <p className="font-flex text-xs text-black opacity-50">{asText(top.data.comment)}</p>
        <ProjectCarousel featuredProjects={featuredProjects} />
      </div>
    </Layout>
  )
}

export default Index

export async function getStaticProps({ previewData }: any) {
  const client = createClient({ previewData })
  const top = await client.getSingle<TopDocument>('top')
  const featuredProjects = await client.getSingle<FeaturedProjectsDocumentWithLinks<TProjectFetchKey>>('featured-projects', {
    fetchLinks: projectFetchKeys.map(key => `project.${key}`)
  })
  const navigation = await client.getSingle<NavigationDocument>("navigation")
  const settings = await client.getSingle<SettingsDocument>("settings")

  return {
    props: {
      top,
      featuredProjects,
      navigation,
      settings,
    },
  }
}
