import { atom } from 'jotai'
import { type StaticImageData } from 'next/future/image'
import defaultTexture from '../public/defaultTexture.jpg'

export const BubbleAtom = atom<StaticImageData['src']>(defaultTexture.src)
