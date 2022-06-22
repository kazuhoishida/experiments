import type { NextPage } from 'next'
import type { FilledLinkToMediaField, FilledLinkToDocumentField } from '@prismicio/types'
import type { ProjectDocument, CreatorDocument, NavigationDocument, SettingsDocument } from '../../prismic-models'
import Head from "next/head"
import Image from 'next/image'
import { PrismicLink, PrismicRichText, SliceZone } from "@prismicio/react"
import * as prismicH from "@prismicio/helpers"
import { asDate, isFilled } from '@prismicio/helpers'

import { createClient, linkResolver } from "../../prismicio"
import { components } from "../../slices"
import { Layout } from "../../components/Layout"
import { Bounded } from "../../components/Bounded"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

const Media = ({field}: {field: FilledLinkToMediaField}) => {
  if( field.link_type !== 'Media' ) {
    return <></>
  }
  if( field.kind === 'image' ) {
    return (
      <div className="relative w-full h-[50vh]">
        <Image src={field.url} alt={field.name} layout="fill" objectFit="contain" />
      </div>
    )
  } else {
    return <>not image</>
  }
}

type ProjectProps = {
  project: ProjectDocument<string>
  creator: CreatorDocument<string>
  navigation: NavigationDocument<string>
}

const Project: NextPage<ProjectProps> = ({ project, creator, navigation }) => {

  const date = asDate(
    project.data.publishDate || project.first_publication_date as any
  )
  const featuredMedia = isFilled.linkToMedia(project.data.featuredMedia) ? project.data.featuredMedia : null
  const face = creator.data?.face?.url ?? null
  
  return (
    <Layout nav={navigation} >
      <Head>
        <title>{project.data.title}</title>
      </Head>
      <article>
        <Bounded className="pb-0">
          {featuredMedia && <Media field={featuredMedia} />}
          <h1 className="mb-3 text-3xl font-semibold tracking-tighter text-slate-800 md:text-4xl">
            {project.data.title}
          </h1>
          <p className="font-serif italic tracking-tighter text-slate-500">
            {dateFormatter.format(date!)}
          </p>
          <PrismicLink className="flex place-items-center gap-x-2" document={creator}>
            {face && <Image className="rounded-full" src={face} alt={creator.data?.face?.alt || ''} width={50} height={50} />}
            {creator.data.name}
          </PrismicLink>
        </Bounded>
        <div>
          <PrismicRichText field={project.data.abstract} />
        </div>
        <div>
          <PrismicRichText field={project.data.description} />
        </div>
        <SliceZone slices={project.data.slices} components={components} />
      </article>
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
  const navigation = await client.getSingle<NavigationDocument>('navigation')

  return {
    props: {
      project,
      creator,
      navigation,
    },
  }
}

export async function getStaticPaths() {
  const client = createClient()

  const projects = await client.getAllByType('project')

  return {
    paths: projects.map((project) => prismicH.asLink(project, linkResolver)),
    fallback: false,
  }
}
