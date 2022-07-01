import type { NextPage, } from 'next'
import type {  ImageLoader, ImageLoaderProps } from 'next/image'
import type { ProjectDocument, NavigationDocument, SettingsDocument } from '../../prismic-models'
import Head from "next/head"
import { Fragment, memo, MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react'
import type { Dispatch, SetStateAction, PropsWithChildren, } from 'react'
import { PrismicLink, PrismicRichText, SliceZone } from "@prismicio/react"
import { isFilled } from '@prismicio/helpers'

import { createClient, } from "../../prismicio"
import { Layout } from "../../components/Layout"
import { Media } from "../../components/Media"
import { Select } from "../../components/Select"
import type { OnChange } from "../../components/Select"
import FilterIcon from '../../components/FilterIcon'
import ArrowIcon from '../../components/ArrowIcon'

import { Disclosure, Transition, } from '@headlessui/react'
import FooterNavigation from '../../components/FooterNavigation'
import Cursol from '../../components/Cursol'
import { FilledLinkToMediaField } from '@prismicio/types'

import { useVirtualizer } from '@tanstack/react-virtual'
import { pluck, union } from 'underscore'

import { screens } from '../../tailwindconfig'


type ProjectCardProps = {
  isVisible: boolean
  media: FilledLinkToMediaField
}

const ProjectCard = ({ isVisible, media }: ProjectCardProps) => {
  const [isCursolVisible, setCursolVisibility] = useState(false)
  const [position, setPosition] = useState({x: 0, y:0})
  const card = useRef<HTMLDivElement>(null)
  const enter: MouseEventHandler<HTMLDivElement> = (e) => setCursolVisibility(true)
  const leave: MouseEventHandler<HTMLDivElement> = (e) => setCursolVisibility(false)
  const move:  MouseEventHandler<HTMLDivElement> = (e) => {
    if( !card.current ){ return }
    const bounding = card.current.getBoundingClientRect()
    const x = e.clientX - bounding.left
    const y = e.clientY - bounding.top
    setPosition({x: x, y:y})
  }
  return (
      <div
        ref={card}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onMouseMove={move}
        className={`
          relative w-full h-full flex-col
          odd:translate-y-[50px]
          sm:odd:translate-y-0      sm:even:translate-y-[50px]
          md:odd:translate-y-[50px] md:even:translate-y-0
          lg:odd:translate-y-0      lg:even:translate-y-[50px]
          border border-[#D2D2D2] overflow-hidden
          hover:cursor-none
          ${isVisible ? 'flex' : 'hidden'}
        `}
      >
        <PrismicLink href="/">
          <Media field={media} className="w-full h-[30vh]" objectFit="cover" />
        </PrismicLink>
        <Cursol isVisible={isCursolVisible} position={position}/>
      </div>
  )
}


type ValidProjectProps = {
  project: ProjectDocument
  selectedTag: string
}

const ValidProject = ({project, selectedTag}: ValidProjectProps) => {
  const featuredMedia = isFilled.linkToMedia(project.data.featuredMedia) ? project.data.featuredMedia : null
  const creator = isFilled.contentRelationship(project.data.creator) ? project.data.creator : null
  const isVisible = selectedTag === '' || project.tags.includes(selectedTag)
  if( !creator || !featuredMedia || !isVisible ) {
    return <></>
  }
  return <ProjectCard isVisible={isVisible} media={featuredMedia} />
}

const normalizeArraySize = function <T>(array: T[], size: number) {
  if( array.length >= size ) {
    return array
  }
  const newArray = new Array(...array)
  for( let i = newArray.length; i < size; i++ ) {
    const item = array.at(i % array.length )
    item && newArray.push(item)
  }
  return newArray
}
/**

array.length = 100
offset = -4
length = 4

realOffset = 100 -4 -1 = 95


array.length = 10
offset = -4
length = 4

realOffset = 10 -4 -1 = 5


array.length = 10
offset = 4
length = 4

realOffset = 4 = 5

 */

const loopSlice = function <T>(array: T[], offset = 0, length = 0) {
  const realOffset = offset < 0 ?
    array.length + offset - 1 : (
      offset < array.length ? offset: offset % array.length - 1
    )
  const sum = realOffset + length
  const isOver = sum > array.length
  if( !isOver ) {
    return array.slice(realOffset, realOffset + length)
  }
  const left = array.slice( realOffset, sum ) // endがサイズを超えたら配列の最後までを返す
  const right = array.slice( 0, sum - array.length )
  return [...left, ...right]
}

type ProjectsGridProps = {
  projects: ProjectDocument[]
  selectedTag: string
}

const ProjectsGrid = ({projects, selectedTag}: ProjectsGridProps) => {
  const option = {
    overscan: 4,
    row: 2,
    col: 2,
  }
  const perPage = option.row * option.col
  const [virtual, setVirtual] = useState({
    offset: 0,
    height: 0,
    perPage: perPage
  })
  const normalizedProjects = normalizeArraySize(projects, perPage + option.overscan * 2)
  return (
    <div className="z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 px-4">
      {loopSlice(projects, virtual.offset - option.overscan, option.overscan).map((project, i) =>
          <ValidProject project={project} selectedTag={selectedTag} key={`${i}-${project.uid}`} />
      )}
      {loopSlice(projects, virtual.offset, perPage).map((project, i) =>
          <ValidProject project={project} selectedTag={selectedTag} key={`${i}-${project.uid}`} />
      )}
      {loopSlice(projects, virtual.offset + perPage, option.overscan).map((project, i) =>
          <ValidProject project={project} selectedTag={selectedTag} key={`${i}-${project.uid}`} />
      )}
    </div>
  )
}

type ProjectsProps = {
  projects: ProjectDocument<string>[]
  navigation: NavigationDocument<string>
}

const Projects: NextPage<ProjectsProps> = ({ projects, navigation }: ProjectsProps) => {
  const options = ['']
  options.push(...union(...pluck(projects, 'tags')))
  const [selectedTag, setTags] = useState('')
  const onChange: OnChange = (newValue) => setTags(newValue)
  const selectProps = {options, onChange}
  return (
    <Layout nav={navigation} >
      <Head>
        <title>Projects</title>
      </Head>
      <main>
        <div className="z-20 sticky top-14 left-4 w-fit drop-shadow-2xl">
          <Disclosure>
            <div
              className={`
                inline-flex justify-between px-6 py-1
                font-serif text-[17px] leading-none text-white bg-[#565656]/60 backdrop-blur-sm rounded-sm
              `}
            >
              <Disclosure.Button>
                <FilterIcon />
              </Disclosure.Button>
              <Transition
                as={Fragment}
                enter="transition duration-300 ease-out"
                enterFrom="transform opacity-0"
                enterTo="transform opacity-100"
                leave="transition duration-200 ease-out"
                leaveFrom="transform opacity-100"
                leaveTo="transform opacity-0"
              >
                <Disclosure.Panel className="inline-flex font-flex font-squash-h6 leading-6s">
                  <label className="flex place-items-center text-[17px] leading-none">
                    <div className="h-full">
                      <span className="leading-none align-middle">category</span>
                    </div>
                    <Select {...selectProps} />
                    <ArrowIcon />
                  </label>
                </Disclosure.Panel>
              </Transition>
            </div>
          </Disclosure>
        </div>
        <ProjectsGrid projects={projects} selectedTag={selectedTag} />
      </main>
      <FooterNavigation />
    </Layout>
  )
}

export default Projects

export const getStaticProps = async () => {
  const client = createClient()

  const projects = await client.getAllByType<ProjectDocument>('project', {
    fetchLinks: ['creator.name', 'creator.face']
  })
  if( !projects?.length ) {
    return {
      notFound: true
    }
  }
  const navigation = await client.getSingle<NavigationDocument>('navigation')

  return {
    props: {
      projects,
      navigation,
    },
  }
}
