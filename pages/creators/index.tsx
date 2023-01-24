import type { NextPage } from 'next'
import { createClient } from "../../prismicio"
import type { NavigationDocument, CreatorDocument } from '../../prismic-models'
import { useUpdateAtom } from 'jotai/utils'
import { FeaturedProjectsAtom } from "../../stores"
import { fetchFeaturedProjects, } from '../../fetches'
import Image from 'next/image'
import { PrismicLink } from '@prismicio/react'
import { Layout } from "../../components/Layout"
import type { FeaturedProjects } from '../../fetches/featuredProject'
import FooterNavigation from "../../components/FooterNavigation"

type CreatorsProps = {
  creators: CreatorDocument[]
  navigation: NavigationDocument
  featuredProjects: FeaturedProjects
}

type CreatorProps = {
  creator: CreatorDocument
}

const CreatorCard = ({ creator }: CreatorProps) => {
  const face = creator.data?.face ?? null
  const occupation = creator.data?.occupation ?? null

  return (
    <figure className='text-center'>
      <PrismicLink document={creator} className='md:hover:opacity-60'>
        <div className='w-full max-w-[180px] h-auto aspect-square mb-4 p-4 md:p-0 mx-auto flex place-items-center place-content-center'>
          {face?.url && <Image alt={face.alt || 'profile'} src={face.url} className="rounded-full" />}
        </div>
      </PrismicLink>
      <figcaption>
        <h2 className='font-bold'>{creator.data?.name}</h2>
        {occupation && <p>{occupation}</p>}
        <PrismicLink document={creator}>
          <span className='font-serif text-[12px] md:text-[14px] border border-black rounded-full px-6 py-2 md:px-10 md:py-3 inline-block mt-4 md:mt-8 whitespace-nowrap md:hover:bg-black md:hover:text-white'>
            VIEW PROFILE
          </span>
        </PrismicLink>
      </figcaption>
    </figure>
  )
}

const Creators: NextPage<CreatorsProps> = ({ creators, navigation, featuredProjects } :CreatorsProps) => {
  const setFeaturedProjects = useUpdateAtom(FeaturedProjectsAtom)
  setFeaturedProjects(featuredProjects)
  return (
    <Layout nav={navigation}>
      <div className='pt-6 md:pt-[6vh] md:pb-[10vh]'>
        <h1 className='font-flex font-squash-h4 text-[48px] text-center'>creators</h1>
        <div className="[background-image:radial-gradient(#E0E0E0_25%,transparent_0%)] [background-size:40px_40px] pt-2 pb-20 mt-4">
          <div className='w-9/10 md:w-4/5 mx-auto'>
            <div className='grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] [--cols:min(2,var(--len))] md:[--cols:min(4,var(--len))] gap-x-2 gap-y-10 justify-between mt-10'
              style={{
                '--len': creators.length,
              }}
            >
              {creators.map(creator => (
                <CreatorCard creator={creator} key={creator.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <FooterNavigation nav={navigation} />
    </Layout>
  )
}
export default Creators

export const getStaticProps = async () => {
  const client = createClient()
  const creators = await client.getAllByType("creator")

  const featuredProjects: FeaturedProjects = await fetchFeaturedProjects(client)

  if( !creators?.length ) {
    return {
      notFound: true
    }
  }

  const navigation = await client.getSingle<NavigationDocument>('navigation')

  return {
    props: {
      creators,
      featuredProjects,
      navigation
    },
  }
}
