import type { NextPage } from 'next'
import { createClient } from "../../prismicio"
import type { NavigationDocument, CreatorDocument } from '../../prismic-models'
import Image from "next/image"
import { PrismicLink } from '@prismicio/react'
import { Layout } from "../../components/Layout"

type CreatorsProps = {
  creators: CreatorDocument[]
  navigation: NavigationDocument
}

type CreatorProps = {
  creator: CreatorDocument
}

const CreatorCard = ({ creator }: CreatorProps) => {
  const face = creator.data?.face ?? null
  const occupation = creator.data?.occupation ?? null

  return (
    <figure className='text-center'>
      <div className='w-full max-w-[180px] h-auto aspect-square mb-4 p-4 md:p-0 mx-auto'>
        {face?.url && <Image alt={face.alt || 'profile'} src={face.url} layout="responsive" objectFit="contain" width={face.dimensions?.width} height={face.dimensions?.height} className="rounded-full" />}
      </div>
      <figcaption>
        <h2 className='font-bold'>{creator.data?.name}</h2>
        {occupation && <p>{occupation}</p>}
        <PrismicLink document={creator}>
          <span className='font-serif text-[12px] md:text-[14px] border border-black rounded-full px-6 py-2 md:px-10 md:py-3 inline-block mt-4 md:mt-8 whitespace-nowrap'>
            VIEW PROFILE
          </span>
        </PrismicLink>
      </figcaption>
    </figure>
  )
}

const Creators: NextPage<CreatorsProps> = ({ creators, navigation } :CreatorsProps) => {
  return (
    <Layout nav={navigation}>
      <div className='bg-v-light-gray min-h-screen pt-10 md:pt-[10vh]'>
        <h1 className='font-flex font-squash-h4 text-[48px] text-center'>creators</h1>
        <div className="[background-image:radial-gradient(#E0E0E0_25%,transparent_0%)] [background-size:40px_40px] pt-2 pb-20 mt-4">
          <div className='w-9/10 md:w-4/5 mx-auto'>
            <div className='grid grid-cols-[var(--sp-cols)] md:grid-cols-[var(--dt-cols)] gap-x-2 gap-y-10 justify-between mt-10'
              style={{
                '--sp-cols': `repeat(${creators.length > 2 ? 2 : 1}, minmax(0, 1fr))`,
                '--dt-cols': `repeat(${creators.length > 4 ? 4 : creators.length}, minmax(0, 1fr))`
              }}
            >
              {creators.map((creator: any, i: number) => (
                <CreatorCard creator={creator} key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Creators

export const getStaticProps = async () => {
  const client = createClient()
  const creators = await client.getAllByType("creator")

  if( !creators?.length ) {
    return {
      notFound: true
    }
  }

  const navigation = await client.getSingle<NavigationDocument>('navigation')

  return {
    props: {
      creators,
      navigation
    },
  }
}
