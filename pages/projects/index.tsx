import type { NextPage } from 'next'
import type { ProjectDocument, NavigationDocument, SettingsDocument } from '../../prismic-models'
import Head from "next/head"
import { useMemo, useState } from 'react'
import { PrismicLink, PrismicRichText, SliceZone } from "@prismicio/react"
import { isFilled } from '@prismicio/helpers'

import { createClient, linkResolver } from "../../prismicio"
import { Layout } from "../../components/Layout"
import { Bounded } from "../../components/Bounded"
import { Media } from "../../components/Media"
import { Select } from "../../components/Select"
import type { OnChange } from "../../components/Select"


type ProjectsProps = {
  projects: ProjectDocument<string>[]
  navigation: NavigationDocument<string>
}

const Projects: NextPage<ProjectsProps> = ({ projects, navigation }: ProjectsProps) => {
  const options = projects.reduce((tags, project) => tags.concat(project.tags), new Array<string>())
  const [selectedTag, setTags] = useState('')
  const onChange: OnChange = (newValue) => setTags(newValue)
  const selectProps = {options, onChange}
  return (
    <Layout nav={navigation} >
      <Head>
        <title>Projects</title>
      </Head>
      TAG: <Select {...selectProps} />
      <article>
        <Bounded className="pb-0">
          <div className="flex">
            {projects.map(project => {
              const featuredMedia = isFilled.linkToMedia(project.data.featuredMedia) ? project.data.featuredMedia : null
              const creator = isFilled.contentRelationship(project.data.creator) ? project.data.creator : null
              if( !creator || !featuredMedia ) {
                return <></>
              }
              const visible = selectedTag === '' || project.tags.includes(selectedTag)
              return (
                <div className={`flex-col ${visible ? 'flex' : 'hidden'}`} key={project.uid}>
                  <Media field={featuredMedia} />
                  <h2 className="mb-3 text-3xl font-semibold tracking-tighter text-slate-800 md:text-4xl">
                    {project.data.title} - {creator.data.name}
                  </h2>
                  <div className="flex">
                    {project.tags.map(tag => (
                      <span key={`${project.id}-${tag}`}>{tag}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Bounded>
      </article>
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
