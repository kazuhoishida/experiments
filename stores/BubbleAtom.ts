import { atom } from 'jotai';
import { type StaticImageData } from 'next/image';
import defaultTexture from '../public/defaultTexture.webp';

export const BubbleAtom = atom<StaticImageData['src']>(defaultTexture.src);
