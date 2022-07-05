import Head from "next/head"
import Image from "next/image"
import { useRef, forwardRef, useState, useEffect } from "react"
import { asText, isFilled } from "@prismicio/helpers"
import type { FeaturedProjectsDocumentWithLinks, ProjectWithFetched, FetchKeyUnion } from "../prismic-additional"
import type { NavigationDocument, SettingsDocument, TopDocument } from "../prismic-models"

import { createClient } from "../prismicio"
import { Layout } from "../components/Layout"

import type { Swiper as SwiperClass } from 'swiper'
import { Navigation, A11y, EffectCreative, Mousewheel, FreeMode } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-creative'
import FooterNavigation from "../components/FooterNavigation"

// fetchLinksに指定するフィールド名
const projectFetchKeys = ['title', 'featuredMedia', 'abstract'] as const
type TProjectFetchKey = FetchKeyUnion<typeof projectFetchKeys>

// ${before('hidden absolute w-[1px] h-[200vh] bg-black top-0 left-0')}

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
    <div className="grid w-full md:w-[var(--slide-width)] md:pt-[8vh]">
      <span className={`
        relative col-start-1 col-end-3 row-start-1 translate-x-[-8%] pointer-events-none
        font-serif text-[clamp(400px,100vw,600px)] text-black leading-none
        bg-white [.swiper-slide-active_&]:bg-transparent
      `}
      >{no}</span>
      <div
        className={`
        relative w-[64vw] md:w-[calc(var(--slide-width)*0.72)] max-h-[80vh] md:max-h-[100vh] justify-self-end
        flex flex-col md:gap-y-8 place-content-center col-start-2 col-end-3 row-start-1 bg-white
        [:is(.swiper-slide-prev,.swiper-slide-active,.swiper-slide-next)_&]:before:block
        before:hidden before:absolute before:w-[1px] before:h-full md:before:h-[300vh] before:bg-black before:top-0 md:before:-top-1/2 before:left-0
      `}>
        <div className="pl-[8%]">
          <h2 className="font-flex font-bold-h1 text-[33.5053px] text-black leading-none overflow-clip">
            {project.data.title}&nbsp;
          </h2>
          <p className="font-flex font-bold-h1 text-[18.8513px] text-black">
            {leadingText}
          </p>
        </div>
        {
          isFilled.linkToMedia(project.data.featuredMedia) && (
            <div className="w-full relative border border-[#D2D2D2] border-l-transparent aspect-1">
              <Image alt={project.data.featuredMedia.name} src={project.data.featuredMedia.url} layout="fill" objectFit="cover" />
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
      <button className={`${className} z-50 md:fixed md:bottom-[1vh]`} ref={ref}>{label}</button>
    )
  }
)

type ProjectCarouselProps = {
  featuredProjects: FeaturedProjectsDocumentWithLinks<TProjectFetchKey>
}

const ProjectCarousel = ({ featuredProjects }: ProjectCarouselProps) => {
  const prev = useRef<HTMLButtonElement>(null)
  const next = useRef<HTMLButtonElement>(null)
  const [swiper, onSwiper] = useState<SwiperClass>()
  const [isWide, setWide] = useState(false)

  const [isLoaded, load] = useState(false)
  const theta = 9
  const [r, setR] = useState(0)
  const [translateY, setY] = useState(0)
  useEffect(() => {
    setWide(window.screen.width >= 768)

    const _r = Math.max(400, window.screen.width * 0.4)
    setR(_r)
    const _y = (1 + Math.cos(theta)) * _r
    console.log('Math.cos(theta) : ', Math.cos(theta))
    console.log('_r : ', _r)
    console.log('_y : ', _y)
    setY(_y)
    load(true)
  }, [])
  return (
    <>
      <div
        className={`
        max-h-[100vh] md:[--slide-width:calc(clamp(768px,100vw,1023px)*0.5)] lg:[--slide-width:calc(clamp(1024px,100vw,1600px)*0.4)]
        translate-x-[calc(var(--slide-width)*0.14)]
      `}>
        {
          isLoaded && (
            <Swiper
              observer={true}
              className="!overflow-visible"
              modules={[Navigation, A11y, EffectCreative, Mousewheel, FreeMode,]}
              effect={"creative"}
              slidesPerView={isWide ? 3 : 1}
              centeredSlides
              mousewheel={true}
              navigation={{
                prevEl: prev.current,
                nextEl: next.current,
              }}
              freeMode={true}
              creativeEffect={{
                limitProgress: 3,
                prev: {
                  translate: [-r, translateY, 0],
                  rotate: [0, 0, -theta],
                  origin: 'center bottom',
                  // origin: '28% bottom',
                },
                next: {
                  translate: [r, translateY, 0],
                  rotate: [0, 0, theta],
                  origin: 'center bottom',
                  // origin: '28% bottom',
                },
              }}
              loop={true}
              onSwiper={onSwiper}
              onSlideChange={() => console.log('slide change')}
            >
              {featuredProjects.data.projects.map((item, i) => {
                if(!isFilled.contentRelationship(item.project)) {
                  return
                }
                const project = item.project
                const leadingText = item.leadingText ?? ''
                return (
                  <SwiperSlide
                    key={i}
                    className={`!overflow-visible bg-white`}
                  >
                    <Project no={i+1} project={project} leadingText={leadingText} />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          )
        }
      </div>
      <div className="w-full flex justify-between md:contents">
        <CarouseNavigation label="← Prev" className="-rotate-12 md:left-[1vw]" ref={prev} />
        <CarouseNavigation label="Next →" className="rotate-12 md:right-[1vw]" ref={next} />
      </div>
    </>
  )
}

type Props = {
  top: TopDocument
  featuredProjects: FeaturedProjectsDocumentWithLinks<TProjectFetchKey>
  nav: NavigationDocument<string>
  settings: SettingsDocument<string>
}

const Index = ({top, featuredProjects, nav, settings }: Props) => {
  return (
    <Layout
      nav={nav}
      className="h-screen overflow-hidden flex flex-col"
    >
      <Head>
        <title>{asText(settings.data.name)}</title>
      </Head>
      <main className="flex flex-col grow pb-[8vh]">
        <div className="h-full flex flex-col justify-between md:justify-start px-[4vw] md:px-0 md:fixed md:top-0 md:left-0 md:w-screen md:h-screen">
          <div>
            <h1 className="font-flex font-squash-h4 text-4xl text-black">{asText(top.data.title)}</h1>
            <p className="font-flex text-xs text-black opacity-50">{asText(top.data.comment)}</p>
          </div>
          <ProjectCarousel featuredProjects={featuredProjects} />
        </div>
      </main>
      <FooterNavigation nav={nav} />
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
  const nav = await client.getSingle<NavigationDocument>("navigation")
  const settings = await client.getSingle<SettingsDocument>("settings")

  return {
    props: {
      top,
      featuredProjects,
      nav,
      settings,
    },
  }
}
