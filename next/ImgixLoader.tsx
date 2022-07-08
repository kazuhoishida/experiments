import type { ImageLoader } from 'next/future/image'

export const ImgixLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(`${normalizeSrc(src)}`)
  const params = url.searchParams
  params.set('auto', params.get('auto') || 'format')
  params.set('fit', params.get('fit') || 'max')
  params.set('w', params.get('w') || width.toString())
  if (quality) {
    params.set('q', quality.toString())
  }
  return url.href
}

function normalizeSrc(src: string) {
  return src[0] === '/' ? src.slice(1) : src
}
