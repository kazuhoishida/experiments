import { asDate, isFilled, asLink } from '@prismicio/helpers'
import { asText } from '@prismicio/richtext'
import { components } from "../../slices"
import { createClient, linkResolver } from "../../prismicio"
import { FeaturedProjectsAtom } from '../../stores'
import { fetchFeaturedProjects } from '../../fetches/featuredProject'
import { Layout } from "../../components/Layout"
import { PrismicLink, PrismicRichText, PrismicText, SliceZone } from "@prismicio/react"
import { useRouter } from 'next/router'
import { useUpdateAtom } from 'jotai/utils'
import FutureImage from '../../next/ImgixImage'
import Head from "next/head"
import type { FeaturedProjects } from '../../fetches/featuredProject'
import type { FilledLinkToMediaField, } from '@prismicio/types'
import type { NextPage } from 'next'
import type { ProjectDocument, CreatorDocument, NavigationDocument, NavigationDocumentDataLinksItem, Simplify, } from '../../prismic-models'
import { Logo } from '../../components/Logo'
import { InputHTMLAttributes, PropsWithChildren, useEffect, useState } from 'react'

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
      <div className="relative w-full">
        <FutureImage src={field.url} alt={field.name} className="w-full max-h-[30vh] object-cover" />
      </div>
    )
  } else {
    return <>not image</>
  }
}

const GoBackNav = () => {
  const router = useRouter()
  const back = () => router.back()
  return (
    <div className="flex place-content-center">
      <button className="flex place-items-center gap-x-10" onClick={back}>
        <div className="grid gap-[2px] grid-cols-3">
          <div className="w-[9px] h-[9px] bg-black"></div>
          <div className="w-[9px] h-[9px] bg-black"></div>
          <div className="w-[9px] h-[9px] bg-black"></div>
          <div className="w-[9px] h-[9px] bg-black"></div>
          <div className="w-[9px] h-[9px] bg-black"></div>
          <div className="w-[9px] h-[9px] bg-black"></div>
          <div className="w-[9px] h-[9px] bg-black"></div>
          <div className="w-[9px] h-[9px] bg-black"></div>
          <div className="w-[9px] h-[9px] bg-black"></div>
        </div>
        <nav className="font-flex font-bold-h1 font-[640] text-3xl">Go Back</nav>
      </button>
    </div>
  )
}

type NavItemProps = PropsWithChildren & InputHTMLAttributes<HTMLLIElement>

const NavItem = ({ children, className }: NavItemProps) => {
  return (
    <li className={className}>{children}</li>
  )
}

type ProjectProps = {
  project: ProjectDocument
  creator: CreatorDocument
  nav: NavigationDocument
  featuredProjects: FeaturedProjects
}

const Project: NextPage<ProjectProps> = ({ project, creator, nav, featuredProjects, }) => {
  const setFeaturedProjects = useUpdateAtom(FeaturedProjectsAtom)
  setFeaturedProjects(featuredProjects)
  const date = asDate(
    project.data.publishDate || project.first_publication_date as any
  )
  const featuredMedia = isFilled.linkToMedia(project.data.featuredMedia) ? project.data.featuredMedia : null
  const face = creator.data?.face?.url ?? null
  const demo = isFilled.link(project.data.demoLink) && project.data.demoLink
  const github = isFilled.link(project.data.github) && project.data.github
  
  return (
    <Layout nav={nav} >
      <Head>
        <title>{project.data.title}</title>
      </Head>
      <main>
        <article>
          {featuredMedia && <Media field={featuredMedia} />}
          <div className="px-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-semibold py-8">
                {project.data.title}
              </h1>
              <div className="flex gap-x-4 place-items-center">
                {face && <FutureImage className="rounded-full w-12 h-12 aspect-1" src={face} alt={(creator.data?.face?.alt || creator.data.name) ?? 'CREATOR'}/>}
                <div className="flex flex-col">
                  <PrismicLink className="flex place-items-center gap-x-2 font-flex font-[640] [font-stretch:32%]" document={creator}>
                    {creator.data.name}
                  </PrismicLink>
                  <p className="font-flex font-[640] [font-stretch:32%]">
                    {dateFormatter.format(date!)}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map(tag => (
                      <div key={tag} className="font-flex font-[640] [font-stretch:32%] text-sm text-black/50">{`#${tag}`}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-x-6 py-4">
              {demo && (
                <PrismicLink field={demo} className="font-flex text-v-red rounded-md border border-v-red w-20 flex place-items-center place-content-center">DEMO</PrismicLink>
              )}
              {github && (
                <PrismicLink field={github} className="font-flex rounded-md border border-black w-20 flex place-items-center place-content-center">GitHub</PrismicLink>
              )}
            </div>
            <div className="font-flex text-sm">
              <PrismicRichText field={project.data.abstract} />
            </div>
            <div className="flex place-content-center py-4">
              <span className={`
                relative font-flex font-squash-h1 font-[800] text-sm
                before:absolute before:w-3/5 before:h-px before:rotate-[20deg] before:origin-right before:bg-black before:-translate-x-full before:top-[180%] before:left-1/2
                after:absolute after:w-3/5 after:h-px after:-rotate-[20deg] after:origin-left after:bg-black after:top-[180%] after:left-1/2
              `}>VIEW MORE</span>
            </div>
            <div className="h-8"></div>
            <div className="flex flex-col">
              {project.data.details.map(({title, description}) => (
                <div key={asText(title)}>
                  <PrismicRichText field={title} />
                  <PrismicRichText field={description} />
                </div>
              ))}
            </div>
            <SliceZone slices={project.data.slices} components={components} />
          </div>
          {demo && (
            <PrismicLink
              field={demo}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 drop-shadow rounded-lg flex place-content-center px-12 py-2"
            >
              <span className="font-flex text-xs text-white">デモを見る</span>
            </PrismicLink>
          )}
        </article>
        <div className="h-8"></div>
        <GoBackNav />
        <div className="h-8"></div>
        <div className="flex flex-nowrap gap-x-4 overflow-x-scroll bg-v-light-gray p-8">
          {featuredProjects.data.projects.map(({project}) =>
            isFilled.contentRelationship(project) && isFilled.linkToMedia(project.data?.featuredMedia) && (
            <div key={project.id} className="flex flex-col shrink-0 gap-y-4 w-[50vw]">
              <FutureImage
                src={project.data?.featuredMedia.url ?? ''}
                alt={project.data?.title ?? 'PROJECT'}
                className="object-cover w-[50vw] h-[30vw]"
              />
              <div className="font-flex font-bold-h6 font-extrabold text-xl overflow-ellipsis">{project.data?.title}</div>
              <div className="font-flex text-xs overflow-ellipsis">{project.data?.leadingText}</div>
            </div>
          ))}
        </div>
        <div className="h-8"></div>
        <div className="px-4">
          <div className="w-full h-px bg-black"></div>
        </div>
        <div className="h-8"></div>
        <div className="w-full flex place-content-center">
          <Logo />
        </div>
        <div className="h-8"></div>
        <ul
          className={`
            w-full flex justify-between px-12 py-2 font-serif text-sm
          `}
        >
          <NavItem>
            <PrismicLink href="/">
              <PrismicText field={nav.data.homepageLabel} />
            </PrismicLink>
          </NavItem>
          {nav.data.links.map(item => {
            return (
            <NavItem key={asText(item.label)}>
              <PrismicLink field={item.link}>
                <PrismicText field={item.label} />
              </PrismicLink>
            </NavItem>
          )})}
        </ul>
        <div className="h-8"></div>
        <div className="w-full flex place-content-center font-serif text-sm">anice lab all rights reserved.</div>
      </main>
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
  const featuredProjects: FeaturedProjects = await fetchFeaturedProjects(client)
  const nav = await client.getSingle<NavigationDocument>('navigation')

  return {
    props: {
      project,
      creator,
      nav,
      featuredProjects,
    },
  }
}

export async function getStaticPaths() {
  const client = createClient()

  const projects = await client.getAllByType('project')

  return {
    paths: projects.map((project) => asLink(project, linkResolver)),
    fallback: false,
  }
}
