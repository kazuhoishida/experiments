import type { NextPage, } from 'next'
import type {  ImageLoader, ImageLoaderProps } from 'next/image'
import type { ProjectDocument, NavigationDocument, SettingsDocument } from '../../prismic-models'
import Head from "next/head"
import { Fragment, useMemo, useState } from 'react'
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

type ProjectsProps = {
  projects: ProjectDocument<string>[]
  navigation: NavigationDocument<string>
}

const Projects: NextPage<ProjectsProps> = ({ projects, navigation }: ProjectsProps) => {
  const options = projects.reduce((tags, project) => tags.concat(project.tags), [''])
  const [selectedTag, setTags] = useState('')
  const onChange: OnChange = (newValue) => setTags(newValue)
  const selectProps = {options, onChange}
  return (
    <Layout nav={navigation} >
      <Head>
        <title>Projects</title>
      </Head>
      <main>
        <div className="sticky top-[2vh] left-4 w-fit">
          <Disclosure>
            <div
              className={`
                inline-flex justify-between px-6 py-1
                font-serif text-[17px] leading-none text-white bg-[#565656]/60 backdrop-blur-sm rounded-sm drop-shadow-md
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 px-4">
          {projects.map(project => {
            const featuredMedia = isFilled.linkToMedia(project.data.featuredMedia) ? project.data.featuredMedia : null
            const creator = isFilled.contentRelationship(project.data.creator) ? project.data.creator : null
            if( !creator || !featuredMedia ) {
              return <></>
            }
            const visible = selectedTag === '' || project.tags.includes(selectedTag)
            return (
              <div
                key={project.uid}
                className={`
                  w-full h-full flex-col z-[-1]
                  odd:translate-y-[50px]
                  sm:odd:translate-y-0      sm:even:translate-y-[50px]
                  md:odd:translate-y-[50px] md:even:translate-y-0
                  lg:odd:translate-y-0      lg:even:translate-y-[50px]
                  border border-[#D2D2D2]
                  ${visible ? 'flex' : 'hidden'}
                `}
              >
                <Media field={featuredMedia} className="w-full h-[30vh]" objectFit="cover" />
                {/* <h2 className="mb-3 text-3xl font-semibold tracking-tighter text-slate-800 md:text-4xl">
                  {project.data.title} - {creator.data.name}
                </h2>
                <div className="flex">
                  {project.tags.map(tag => (
                    <span key={`${project.id}-${tag}`}>{tag}</span>
                  ))}
                </div> */}
              </div>
            )
          })}
        </div>
      </main>
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
