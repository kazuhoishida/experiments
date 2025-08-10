import type {
    FilledLinkToDocumentField,
    PrismicDocumentWithoutUID,
    PrismicDocumentWithUID,
    GroupField,
    RelationField,
} from '@prismicio/types';
import type {
    CreatorDocumentData,
    ProjectDocumentData,
    FeaturedProjectsDocumentDataProjectsItem,
    FeaturedProjectsDocumentData,
} from './prismic-models';

type Simplify<T> = {
    [KeyType in keyof T]: T[KeyType];
};

type CreatorDocumentDataKey = keyof CreatorDocumentData;
type CreatorFetchKeyUnion<T = CreatorDocumentDataKey> = Extract<CreatorDocumentDataKey, T>;
type CreatorWithFetched<U extends CreatorFetchKeyUnion<T>> = RelationField<
    'project',
    string,
    Pick<CreatorDocumentData, U>
>;

type FeaturedProjectCreatorDocument<
    U extends CreatorFetchKeyUnion<T> = CreatorDocumentDataKey,
    Lang extends string = string,
> = PrismicDocumentWithUID<Simplify<Pick<CreatorDocumentData, U>>, 'creator', Lang>;

interface FeaturedProjectDocumentData<U extends CreatorFetchKeyUnion<T> = CreatorDocumentDataKey>
    extends ProjectDocumentData {
    creator: RelationField<'creator', string, FeaturedProjectCreatorDocument<U>>;
}

type FeaturedProjectDocumentDataKey<T extends CreatorFetchKeyUnion = CreatorDocumentDataKey> =
    keyof FeaturedProjectDocumentData<T>;
type ProjectFetchKeyUnion<T = FeaturedProjectDocumentDataKey> = Extract<FeaturedProjectDocumentDataKey, T>;
type ProjectWithFetched<
    U extends ProjectFetchKeyUnion<T>,
    V extends CreatorFetchKeyUnion = CreatorDocumentDataKey,
> = RelationField<'project', string, Pick<FeaturedProjectDocumentData<V>, U>>;

// FeaturedProjectsDocument の related content を解決できるように拡張する
interface FeaturedProjectsDocumentDataProjectsItemFilled<
    U extends ProjectFetchKeyUnion<T>,
    V extends CreatorFetchKeyUnion = CreatorDocumentDataKey,
> extends FeaturedProjectsDocumentDataProjectsItem {
    project: ProjectWithFetched<U, V>;
}
interface FeaturedProjectsDocumentDataFilled<
    U extends ProjectFetchKeyUnion<T>,
    V extends CreatorFetchKeyUnion = CreatorDocumentDataKey,
> extends FeaturedProjectsDocumentData {
    projects: GroupField<Simplify<FeaturedProjectsDocumentDataProjectsItemFilled<U, V>>>;
}

type FeaturedProjectsDocumentWithLinks<
    U extends ProjectFetchKeyUnion<T>,
    V extends CreatorFetchKeyUnion = CreatorDocumentDataKey,
    Lang extends string = string,
> = PrismicDocumentWithoutUID<Simplify<FeaturedProjectsDocumentDataFilled<U, V>>, 'featured-projects', Lang>;
