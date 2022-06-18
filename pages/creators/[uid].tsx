import type { InferGetStaticPropsType, NextPage } from 'next'
import Image from 'next/image'
import Head from "next/head"
import { SliceZone } from "@prismicio/react"
import * as prismicH from "@prismicio/helpers"

import { createClient, linkResolver } from "../../prismicio"
import { components } from "../../slices"
import { Layout } from "../../components/Layout"
import { Bounded } from "../../components/Bounded"

const Creator: NextPage<any> = ({ creator, navigation, settings }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout
      withHeaderDivider={false}
      withProfile={false}
      navigation={navigation}
      settings={settings}
    >
      <Head>
        <title>{creator.data.name}</title>
      </Head>
      <article>
        <Bounded className="pb-0">
          <h1 className="mb-3 text-3xl font-semibold tracking-tighter text-slate-800 md:text-4xl">
            {creator.data.name}
          </h1>
          <Image src={creator.data?.face?.url} alt={creator.data?.face?.alt} width={100} height={100} />
        </Bounded>
        <SliceZone slices={creator.data.slices} components={components} />
      </article>
    </Layout>
  )
}

export default Creator

export const getStaticProps = async ({
  params,
  previewData
}: any) => {
  const client = createClient({ previewData })

  const uid = params?.uid ?? ''
  const creator = await client.getByUID("creator", uid)
  const navigation = await client.getSingle("navigation")
  const settings = await client.getSingle("settings")

  return {
    props: {
      creator,
      navigation,
      settings,
    },
  }
}

export async function getStaticPaths() {
  const client = createClient()

  const creators = await client.getAllByType("creator")

  return {
    paths: creators.map((creator) => prismicH.asLink(creator, linkResolver)),
    fallback: false,
  }
}
