import { atom, type WritableAtom } from 'jotai'
import type { FeaturedProjects } from '../fetches/featuredProject'

export const FeaturedProjectsAtom: WritableAtom<
  FeaturedProjects | null,
  FeaturedProjects,
  void
> = atom(null, (_get, set, update) => {
  set(FeaturedProjectsAtom, update)
})
