import { atom } from 'jotai'
import type { FeaturedProjects, } from '../fetches/featuredProject'

export const FeaturedProjectsAtom = atom<FeaturedProjects | null>(null)
