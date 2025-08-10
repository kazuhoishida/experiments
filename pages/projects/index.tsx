import { createClient } from '../../prismicio'
import { Disclosure } from '@headlessui/react'
import { FeaturedProjectsAtom } from '../../stores'
import {
  type FeaturedProjects,
  fetchFeaturedProjects,
} from '../../fetches/featuredProject'
import { FilledLinkToMediaField } from '@prismicio/types'
import { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react'
import { isFilled, documentToLinkField } from '@prismicio/helpers'
import { Layout } from '../../components/Layout'
import { Media } from '../../components/Media'
import { pluck, union } from 'underscore'
import { PrismicLink } from '@prismicio/react'
import { Select } from '../../components/Select'
import { useUpdateAtom } from 'jotai/utils'
import CaretIcon from '../../components/CaretIcon'
import Cursor from '../../components/Cursor'
import FooterNavigation from '../../components/FooterNavigation'
import Head from 'next/head'
import type { InputHTMLAttributes } from 'react'
import type { NextPage } from 'next'
import type { OnChange } from '../../components/Select'
import type { ProjectDocument, NavigationDocument } from '../../prismic-models'
import gsap from 'gsap'

type ProjectCardProps = InputHTMLAttributes<HTMLDivElement> & {
  project: ProjectDocument
  isVisible: boolean
  media: FilledLinkToMediaField
  title: string
  leading: string
}

const ProjectCard = ({
  project,
  isVisible,
  media,
  title,
  leading,
  style,
}: ProjectCardProps) => {
  const [isCursorVisible, setCursorVisibility] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const card = useRef<HTMLDivElement>(null)
  const enter: MouseEventHandler<HTMLDivElement> = (e) =>
    setCursorVisibility(true)
  const leave: MouseEventHandler<HTMLDivElement> = (e) =>
    setCursorVisibility(false)
  const move: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!card.current) {
      return
    }
    const bounding = card.current.getBoundingClientRect()
    const x = e.clientX - bounding.left
    const y = e.clientY - bounding.top
    setPosition({ x: x, y: y })
  }

  // fade in each project card with gsap
  useEffect(() => {
    gsap.set('.project-card', {
      opacity: 0,
      y: '20px',
    })

    gsap.to('.project-card', {
      stagger: 0.1,
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    })
  }, [style])

  return (
    <div className="project-card translate-y-[20px] opacity-0">
      <div
        ref={card}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onMouseMove={move}
        className={`
          relative h-full w-full translate-y-[var(--translateY)] flex-col overflow-hidden drop-shadow
          ${isVisible ? 'flex' : 'hidden'}
        `}
        style={style}
      >
        <PrismicLink field={documentToLinkField(project)}>
          <div
            className={`absolute top-8 left-2 z-10 hidden gap-2 text-white transition-all duration-[400ms] md:grid ${
              isCursorVisible
                ? '-translate-y-2 opacity-100'
                : 'translate-y-0 opacity-0'
            }`}
          >
            <h2 className="font-bold-h1 font-flex text-[30px] leading-none drop-shadow">
              {title}
            </h2>
            <p className="text-[13px] leading-tight drop-shadow">{leading}</p>
          </div>
          <Media
            field={media}
            className="h-[66.6vw] w-full md:h-[33.3vw] lg:h-[26.6vw]"
          />
        </PrismicLink>
        <Cursor isVisible={isCursorVisible} position={position} />
      </div>
    </div>
  )
}

type ValidProjectProps = Partial<ProjectCardProps> & {
  project: ProjectCardProps['project']
  selectedTag: string
}

const ValidProject = ({ project, selectedTag, style }: ValidProjectProps) => {
  const featuredMedia = isFilled.linkToMedia(project.data.featuredMedia)
    ? project.data.featuredMedia
    : null
  const projectTitle = project.data.title ?? ''
  const projectLeading = project.data.leadingText ?? ''
  const creator = isFilled.contentRelationship(project.data.creator)
    ? project.data.creator
    : null
  const isVisible = selectedTag === '' || project.tags.includes(selectedTag)
  if (!creator || !featuredMedia || !isVisible) {
    return <></>
  }
  const props = {
    project,
    style,
    isVisible,
    media: featuredMedia,
    title: projectTitle,
    leading: projectLeading,
  }
  return <ProjectCard {...props} />
}

const loopSlice = function <T>(array: T[], offset = 0, length = 0) {
  const realOffset =
    Math.abs(offset) === array.length
      ? 0
      : offset < 0
      ? array.length + offset - 1
      : offset < array.length
      ? offset
      : (offset % array.length) - 1
  const sum = realOffset + length
  const newArray = new Array<T>()
  for (let i = realOffset; i < sum; i++) {
    const item = array[i % array.length]
    item && newArray.push(item)
  }
  return newArray
}

type ProjectsGridProps = {
  projects: ProjectDocument[]
  selectedTag: string
}

const ProjectsGrid = ({ projects, selectedTag }: ProjectsGridProps) => {
  const [row] = useState(2)
  const [col, setCol] = useState(2)
  const [overscan, setOverscan] = useState(4)
  const perPage = row * col
  const [virtual, setVirtual] = useState({
    offset: 0,
    height: 0,
    perPage: perPage,
  })
  const [vw, setVw] = useState(0)
  useEffect(() => {
    if (!window) return
    window.addEventListener('resize', () => setVw(window.innerWidth))
    setVw(window.innerWidth)
  }, [setVw])
  useEffect(() => {
    if (1024 <= vw) {
      setOverscan(10)
      setCol(5)
    } else if (768 <= vw) {
      setOverscan(8)
      setCol(4)
    } else if (640 <= vw) {
      setOverscan(6)
      setCol(3)
    } else {
      setCol(2)
    }
  }, [vw])
  const infiniteProjects = useMemo(
    () => [
      ...loopSlice(projects, virtual.offset - overscan, overscan),
      ...loopSlice(projects, virtual.offset, perPage),
      ...loopSlice(projects, virtual.offset + perPage, overscan),
    ],
    [projects, virtual.offset, overscan, perPage]
  )
  // NEED TO UPDATE
  // temporarily disabled the infinite scroll
  // const gallery = selectedTag === '' ? infiniteProjects : projects
  const gallery = projects
  return (
    <div className="z-10 mt-10 mb-[100px] grid grid-cols-2 gap-2 sm:grid-cols-3 md:mb-[140px] md:grid-cols-4 md:gap-4 md:px-4 lg:grid-cols-5">
      {gallery.map((project, i) => (
        <ValidProject
          project={project}
          selectedTag={selectedTag}
          key={`${i}-${project.uid}`}
          style={{
            '--translateY': (i % col) % 2 === 1 ? '50px' : '0',
          }}
        />
      ))}
    </div>
  )
}

type ProjectsProps = {
  projects: ProjectDocument[]
  featuredProjects: FeaturedProjects
  nav: NavigationDocument
}

const Projects: NextPage<ProjectsProps> = ({
  projects,
  featuredProjects,
  nav,
}: ProjectsProps) => {
  const setFeaturedProjects = useUpdateAtom(FeaturedProjectsAtom)
  setFeaturedProjects(featuredProjects)
  const options = ['']
  options.push(...union(...pluck(projects, 'tags')))
  const [selectedTag, setTags] = useState('')
  const onChange: OnChange = (newValue) => setTags(newValue)
  const selectProps = { options, onChange }

  return (
    <Layout nav={nav}>
      <Head>
        <title>Projects</title>
      </Head>
      <main>
        <div className="fixed top-[76px] left-4 z-20 w-fit drop-shadow-2xl">
          <Disclosure>
            <div
              className={`
                inline-flex items-center justify-between gap-2
                rounded-sm bg-v-soft-black/70 font-serif text-[17px] leading-none text-white backdrop-blur-sm
                duration-[400ms] md:hover:bg-black/70
              `}
            >
              <div className="leading-6s font-squash-h6 inline-flex px-6 py-2 font-flex">
                <label className="flex cursor-pointer place-items-center gap-2 text-[12px] leading-none sm:text-[17px]">
                  <div className="h-full">
                    <span className="align-middle uppercase leading-none">
                      CATEGORY:
                    </span>
                  </div>
                  <Select {...selectProps} />
                  <CaretIcon />
                </label>
              </div>
            </div>
          </Disclosure>
        </div>
        <ProjectsGrid projects={projects} selectedTag={selectedTag} />
      </main>
      <FooterNavigation nav={nav} />
    </Layout>
  )
}

export default Projects

export const getStaticProps = async () => {
  const client = createClient()

  const projects = await client.getAllByType<ProjectDocument>('project', {
    fetchLinks: ['creator.name', 'creator.face'],
  })
  if (!projects?.length) {
    return {
      notFound: true,
    }
  }
  const featuredProjects: FeaturedProjects = await fetchFeaturedProjects(client)
  const nav = await client.getSingle<NavigationDocument>('navigation')

  return {
    props: {
      projects,
      featuredProjects,
      nav,
    },
  }
}
