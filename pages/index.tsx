import 'swiper/css'
import 'swiper/css/effect-creative'
import 'swiper/css/navigation'
import { asText, isFilled } from "@prismicio/helpers"
import { createClient } from "../prismicio"
import { FeaturedProjectsAtom } from "../stores"
import { fetchFeaturedProjects, } from '../fetches'
import { Layout } from "../components/Layout"
import { Navigation, A11y, EffectCreative, Mousewheel, FreeMode } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useRef, forwardRef, useState, useEffect } from "react"
import { useUpdateAtom } from 'jotai/utils'
import FooterNavigation from "../components/FooterNavigation"
import Head from "next/head"
import FutureImage from "../next/ImgixImage"
import type { FeaturedProject, FeaturedProjects } from '../fetches/featuredProject'
import type { NavigationDocument, SettingsDocument, TopDocument } from "../prismic-models"
import type { Swiper as SwiperClass } from 'swiper'
import { PrismicLink } from '@prismicio/react'
import gsap from 'gsap'
import Projects from './projects'

type ProjectProps = {
  no: number
  project: FeaturedProject
  length: number
}
const Project = ({ no, project, length }: ProjectProps) => {
  useEffect(() => {
    gsap.set('.featured-project-card', {
      opacity: 0,
    })

    gsap.to('.featured-project-card', {
      stagger: 0.1,
      opacity: 1,
      ease: 'power2.out'
    })
  }, [])

  const setLoadingEager = (num: number) => {
    return (num === 1 || num === 2 || num === length)
  }

  if( !isFilled.contentRelationship(project) || !project.data) {
    return <></>
  }
  return (
    <PrismicLink field={project} className="featured-project-card duration-[400ms] opacity-0 outline-0">
      <div className="grid items-end w-full md:w-[var(--slide-width)] md:pt-0 duration-500">
        <span className={`
          relative col-start-1 col-end-3 row-start-1 translate-x-[4%] [.swiper-slide-active_&]:translate-x-[-5%] md:[.swiper-slide-active_&]:translate-x-[-25%] transition-all duration-[500ms] pointer-events-none
          font-serif text-[clamp(400px,100vw,600px)] md:text-[50vw] text-black leading-none
          [.swiper-slide-active_&]:bg-transparent
          md:[clip-path:polygon(0_0,16%_0%,16%_100%,0%_100%)] [clip-path:polygon(0_0,31%_0%,31%_100%,0%_100%)] md:[.swiper-slide-active_&]:[clip-path:polygon(0_0,45%_0%,45%_100%,0%_100%)]
        `}
        >{no}</span>
        <div
          className={`
          relative w-[68vw] md:w-[calc(var(--slide-width)*0.8)] max-h-[80vh] justify-self-end
          flex flex-col gap-y-4 md:gap-y-8 place-content-end col-start-2 col-end-3 row-start-1 bg-white
          translate-y-[-4%] md:translate-y-[-20%]
          [:is(.swiper-slide-prev,.swiper-slide-active,.swiper-slide-next)_&]:before:block
          before:hidden before:absolute before:w-[1px] before:h-[300vh] before:bg-black before:top-[-100vh] before:left-0
        `}>
          <div className="pl-[8%]">
            <h2 className="font-flex font-bold-h1 text-[32px] md:text-[3vw] text-black leading-none mb-2">
              <>{project.data.title}&nbsp;</>
            </h2>
            <p className="font-flex font-bold-h1 text-md md:text-[1vw] text-black leading-none">
              {project.data.leadingText}
            </p>
          </div>
          {
            isFilled.linkToMedia(project.data.featuredMedia) && (
              <div className="w-full relative border border-v-dark-gray border-l-transparent aspect-[4/3]">
                <FutureImage alt={project.data.featuredMedia.name} src={project.data.featuredMedia.url} loading={setLoadingEager(no) ? 'eager' : 'lazy'} className="w-full h-full object-cover" />
              </div>
            )
          }
        </div>
      </div>
    </PrismicLink>
  )
}

type CarouseNavigationProps = {
  label: string
  className: string
}

const CarouseNavigation = forwardRef<HTMLButtonElement, CarouseNavigationProps>(
  function CarouseNavigation({ label, className }, ref) { // ここで関数名を付けないとeslintに引っかかる
    return (
      <button className={`${className} font-flex font-arrow font-extrabold text-[20px] z-30 fixed bottom-24 md:bottom-[3vh]`} ref={ref}>{label}</button>
    )
  }
)

type ProjectCarouselProps = {
  featuredProjects: FeaturedProjects
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
    setY(_y)
    load(true)
  }, [])

  return (
    <>
      <div
        className={`
        max-h-[100vh] md:[--slide-width:calc(clamp(768px,100vw,1023px)*0.5)] lg:[--slide-width:calc(max(1024px,100vw)*0.35)]
        md:translate-x-[calc(var(--slide-width)*0.24)]
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
              {featuredProjects.data.projects.slice(0, 9).map((item, i) =>
                isFilled.contentRelationship(item.project) && (
                  <SwiperSlide
                    key={item.project.id}
                    className={`!overflow-visible`}
                  >
                    <Project no={i+1} length={featuredProjects.data.projects.length} project={item.project} />
                  </SwiperSlide>
                ))
              }
            </Swiper>
          )
        }
      </div>
      <div className="xs:hidden w-full flex justify-between md:contents">
        <CarouseNavigation label="← Prev." className="-rotate-[9deg] left-[4vw] md:left-[2vw]" ref={prev} />
        <CarouseNavigation label="Next →" className="rotate-[9deg] right-[4vw] md:right-[2vw]" ref={next} />
      </div>
    </>
  )
}

type Props = {
  top: TopDocument
  featuredProjects: FeaturedProjects
  nav: NavigationDocument
  settings: SettingsDocument
}

const Index = ({top, featuredProjects, nav, settings }: Props) => {
  const setFeaturedProjects = useUpdateAtom(FeaturedProjectsAtom)
  setFeaturedProjects(featuredProjects)
  return (
    <Layout
      nav={nav}
      className="overflow-hidden flex flex-col"
    >
      <Head>
        <title>{asText(settings.data.name)}</title>
      </Head>
      <main>
        <div className="h-full px-[4vw] md:px-0 md:fixed md:left-4 w-screen">
          <div className='md:absolute md:-top-6 md:left-[5vw] z-50 md:mb-0'>
            <h1 className="font-flex font-squash-h4 text-[9vw] md:text-[5vw] text-black leading-none mb-2 md:mb-[0.2vw]">{asText(top.data.title)}</h1>
            <p className="font-flex font-bold text-[14px] text-black pl-[0.5vw]">{asText(top.data.comment)}</p>
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
  const featuredProjects: FeaturedProjects = await fetchFeaturedProjects(client)
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
