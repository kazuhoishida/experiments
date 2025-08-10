import type { Client } from '@prismicio/client';
import type {
    FeaturedProjectsDocumentWithLinks,
    ProjectFetchKeyUnion,
    CreatorFetchKeyUnion,
} from '../prismic-additional';

// fetchLinksに指定するフィールド名
const projectFetchKeys = ['title', 'featuredMedia', 'leadingText', 'creator'] as const;
export type TProjectFetchKey = ProjectFetchKeyUnion<(typeof projectFetchKeys)[number]>;

const creatorFetchKeys = ['name', 'face'] as const;
export type TCreatorFetchKey = CreatorFetchKeyUnion<(typeof creatorFetchKeys)[number]>;

export function fetchFeaturedProjects(client: Client) {
    return client.getSingle<FeaturedProjectsDocumentWithLinks<TProjectFetchKey, TCreatorFetchKey>>(
        'featured-projects',
        {
            fetchLinks: [
                ...projectFetchKeys.map(key => `project.${key}`),
                ...creatorFetchKeys.map(key => `creator.${key}`),
            ],
        }
    );
}

export type FeaturedProjects = Awaited<ReturnType<typeof fetchFeaturedProjects>>;
export type FeaturedProject = FeaturedProjects['data']['projects'][number]['project'];
