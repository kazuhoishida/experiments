import type { FilledLinkToDocumentField, PrismicDocumentWithoutUID, GroupField, RelationField } from '@prismicio/types'
import type { ProjectDocument, FeaturedProjectsDocumentDataProjectsItem } from "./prismic-models"

type Simplify<T> = {
  [KeyType in keyof T]: T[KeyType]
}
type FetchKeyUnion<T extends string[] | readonly string[]> = T[number] // array to union type
type ProjectWithFetched<U extends FetchKeyUnion<T>> = RelationField<"project", string, Pick<ProjectDocument['data'], U>>

// FeaturedProjectsDocument の related content を解決できるように拡張する
interface FeaturedProjectsDocumentDataProjectsItemFilled<U extends FetchKeyUnion<T>> extends FeaturedProjectsDocumentDataProjectsItem {
  project: ProjectWithFetched<U>
}
interface FeaturedProjectsDocumentDataFilled<U extends FetchKeyUnion<T>> extends FeaturedProjectsDocumentData {
  projects: GroupField<Simplify<FeaturedProjectsDocumentDataProjectsItemFilled<U>>>
}

type FeaturedProjectsDocumentWithLinks<U extends FetchKeyUnion<T>, Lang extends string = string> = PrismicDocumentWithoutUID<Simplify<FeaturedProjectsDocumentDataFilled<U>>, "featured-projects", Lang>
