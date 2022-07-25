import { atom } from 'jotai'
import defaultTexture from '../public/defaultTexture.jpg'

export const BubbleAtom = atom<any | null>(defaultTexture.src)
