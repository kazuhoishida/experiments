import React from 'react'
import { PrismicLink } from '@prismicio/react'
import { asDate, isFilled } from '@prismicio/helpers'
import FutureImage from '../next/ImgixImage'
import type { SliceComponentProps } from '@prismicio/react'
import type { WorkSlice } from '../prismic-models'


const WorkSlice = ({ slice, index }: SliceComponentProps<WorkSlice>) => {
  return (
    <div className='flex gap-x-4 justify-between [&_div]:hover:!opacity-100 [&_div]:hover:!z-10'>
      <div className='flex justify-start gap-x-4 md:w-1/2'>
        {slice.primary.date && <time dateTime={asDate(slice.primary.date).toString()}>{ slice.primary.date.replace(/-/g, '/') }</time>}
        <div>
          <div className='[&>h2]:!text-sm'>
            {slice.primary.title && <h3>{slice.primary.title[0]?.text}</h3>}
          </div>
          {slice.primary.role && <p className='text-sm mt-2 mb-2'>{ slice.primary.role }</p>}
          {slice.primary.link && <PrismicLink field={slice.primary.link} className='text-sm underline'>ウェブサイトを見る</PrismicLink>}
        </div>
      </div>
      {isFilled.imageThumbnail(slice.primary.Thumbnail) && (
        <div className={`hidden md:block w-1/2 absolute top-0 right-0 transition-opacity duration-[400ms] ${index === 0 ? 'opacity-100' : 'opacity-0'}`}>
          <FutureImage
            src={slice.primary.Thumbnail?.url ?? ''}
            alt={slice.primary.Thumbnail.alt ?? 'WORK THUMBNAIL'}
            className="object-cover w-full aspect-[5/3] max-h-[40vh]"
          />
        </div>
      )}
    </div>
  )
}

export default WorkSlice