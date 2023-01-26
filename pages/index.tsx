import "swiper/css"
import "swiper/css/effect-creative"
import "swiper/css/navigation"
import { asText, isFilled } from "@prismicio/helpers"
import { createClient } from "../prismicio"
import { FeaturedProjectsAtom } from "../stores"
import { fetchFeaturedProjects } from "../fetches"
import { Layout } from "../components/Layout"
import { Navigation, A11y, EffectCreative, Mousewheel, FreeMode } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { useRef, forwardRef, useState, useEffect } from "react"
import { useUpdateAtom } from "jotai/utils"
import FooterNavigation from "../components/FooterNavigation"
import Head from "next/head"
import Image from "next/image"
import type { FeaturedProject, FeaturedProjects } from "../fetches/featuredProject"
import type { NavigationDocument, SettingsDocument, TopDocument } from "../prismic-models"
import type { Swiper as SwiperClass } from "swiper"
import { PrismicLink } from "@prismicio/react"
import gsap from "gsap"

type ProjectProps = {
  no: number
  project: FeaturedProject
  length: number
}
const Project = ({ no, project, length }: ProjectProps) => {
  useEffect(() => {
    gsap.to(".featured-project-card", {
      delay: 0.5,
      stagger: 0.1,
      opacity: 1,
      ease: "power2.out",
    })
  }, [])

  const setLoadingEager = (num: number) => {
    return num === 1 || num === 2 || num === length
  }

  if (!isFilled.contentRelationship(project) || !project.data) {
    return <></>
  }
  return (
    <PrismicLink field={project} className="featured-project-card block opacity-0 outline-0 duration-[400ms]">
      <div className="group grid w-full items-end opacity-0 duration-[300ms] md:w-[var(--slide-width)] md:pt-0 md:opacity-100 [.swiper-slide-active_&]:opacity-100">
        <div
          className={`
          pointer-events-none relative col-start-1 col-end-3 row-start-1
          inline-grid translate-x-[-73.5%] overflow-hidden md:translate-x-[-80%]
        `}
        >
          <span
            className={`
            inline-block translate-x-[78%] font-serif text-[clamp(400px,100vw,600px)] leading-none text-black
            transition-transform duration-[400ms] md:text-[50vw] [.swiper-slide-active_&]:translate-x-[70%] md:[.swiper-slide-active_&]:translate-x-[60%]
          `}
          >
            {no}
          </span>
        </div>
        <div
          className={`
          relative col-start-2 col-end-3 row-start-1 flex
          max-h-[80vh] w-[68vw] translate-y-[-4%] flex-col place-content-end gap-y-4 justify-self-end bg-white transition-transform
          duration-[400ms] before:absolute
          before:top-[-100vh]
          before:left-0 before:hidden before:h-[300vh] before:w-[1px] before:bg-black md:w-[calc(var(--slide-width)*0.8)] md:translate-y-[-20%]
          md:gap-y-8
          md:group-hover:translate-y-[-26%] [:is(.swiper-slide-prev,.swiper-slide-active,.swiper-slide-next)_&]:before:block
        `}
        >
          <div className="pl-[8%]">
            <h2 className="font-bold-h1 mb-2 font-flex text-[32px] leading-none text-black md:text-[3vw]">
              <>{project.data.title}&nbsp;</>
            </h2>
            <p className="text-md font-bold-h1 font-flex leading-none text-black md:text-[1vw]">{project.data.leadingText}</p>
          </div>
          {isFilled.linkToMedia(project.data.featuredMedia) && (
            <div className="duratino-[400ms] relative aspect-[4/3] w-full border-l-transparent shadow transition-shadow md:group-hover:shadow-md">
              {project.data.featuredMedia.url.endsWith(".gif") ? (
                <img alt={project.data.featuredMedia.name} src={project.data.featuredMedia.url} loading={setLoadingEager(no) ? "eager" : "lazy"} className="h-full w-full object-cover" />
              ) : (
                <Image alt={project.data.featuredMedia.name} src={project.data.featuredMedia.url} fill loading={setLoadingEager(no) ? "eager" : "lazy"} className="h-full w-full object-cover" />
              )}
            </div>
          )}
        </div>
      </div>
    </PrismicLink>
  )
}

type CarouseNavigationProps = {
  label: string
  className: string
}

const CarouseNavigation = forwardRef<HTMLButtonElement, CarouseNavigationProps>(function CarouseNavigation({ label, className }, ref) {
  // ここで関数名を付けないとeslintに引っかかる
  return (
    <button className={`${className} font-arrow fixed bottom-24 z-30 font-flex text-[20px] font-extrabold md:bottom-[3vh]`} ref={ref}>
      {label}
    </button>
  )
})

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
    let _r, _y

    setWide(window.screen.width >= 768)
    _r = Math.max(400, window.screen.width * 0.4)
    setR(_r)
    _y = (1 + Math.cos(theta)) * _r
    setY(_y)
    load(true)

    const handleResize = () => {
      setWide(window.screen.width >= 768)
      _r = Math.max(400, window.screen.width * 0.4)
      setR(_r)
      _y = (1 + Math.cos(theta)) * _r
      setY(_y)
    }
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <div
        className={`
        max-h-[100vh] md:translate-x-[calc(var(--slide-width)*0.24)] md:translate-y-[calc(var(--slide-width)*-0.1)]
        md:[--slide-width:calc(clamp(768px,100vw,1023px)*0.5)] lg:[--slide-width:calc(max(1024px,100vw)*0.35)]
      `}
      >
        {isLoaded && (
          <Swiper
            observer={true}
            className="!overflow-visible"
            modules={[Navigation, A11y, EffectCreative, Mousewheel, FreeMode]}
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
                origin: "center bottom",
              },
              next: {
                translate: [r, translateY, 0],
                rotate: [0, 0, theta],
                origin: "center bottom",
              },
            }}
            loop={true}
            onSwiper={onSwiper}
          >
            {featuredProjects.data.projects.slice(0, 9).map(
              (item, i) =>
                isFilled.contentRelationship(item.project) && (
                  <SwiperSlide key={item.project.id} className={`!overflow-visible`}>
                    <Project no={i + 1} length={featuredProjects.data.projects.length} project={item.project} />
                  </SwiperSlide>
                )
            )}
          </Swiper>
        )}
      </div>
      <div className="flex w-full justify-between md:contents xs:hidden">
        <CarouseNavigation label="← Prev." className="left-[4vw] -rotate-[9deg] md:left-[2vw]" ref={prev} />
        <CarouseNavigation label="Next →" className="right-[4vw] rotate-[9deg] md:right-[2vw]" ref={next} />
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

const Index = ({ top, featuredProjects, nav, settings }: Props) => {
  const setFeaturedProjects = useUpdateAtom(FeaturedProjectsAtom)
  setFeaturedProjects(featuredProjects)

  const [loaded, setLoad] = useState<boolean>(false)
  useEffect(() => {
    setLoad(true)
  }, [])
  return (
    <Layout nav={nav} className="flex flex-col overflow-hidden">
      <Head>
        <title>{asText(settings.data.name)}</title>
      </Head>
      <main>
        <div className="h-full w-screen px-[4vw] md:fixed md:left-4 md:px-0">
          <div className="z-50 grid md:absolute md:-top-6 md:left-[5vw] md:mb-0 md:gap-4">
            <h1 className={`font-squash-h4 mb-2 overflow-hidden font-flex text-[9vw] leading-[0.9em] text-black md:mb-[0.2vw] md:max-w-[50vw] md:text-[3.6vw]`}>
              <span className={`inline-block delay-[200ms] duration-[800ms] ${loaded ? "translate-y-0" : "translate-y-[100%]"}`}>{asText(top.data.title)}</span>
            </h1>
            <p className={`overflow-hidden pl-[0.5vw] font-flex text-[14px] font-bold text-black`}>
              <span className={`inline-block delay-[300ms] duration-[800ms] ${loaded ? "translate-y-0" : "translate-y-[100%]"}`}>{asText(top.data.comment)}</span>
            </p>
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
  const top = await client.getSingle<TopDocument>("top")
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
