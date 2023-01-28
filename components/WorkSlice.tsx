import { useState, useEffect } from 'react'
import { type SliceComponentProps, PrismicLink } from '@prismicio/react'
import { asDate, isFilled } from '@prismicio/helpers'
import Image from 'next/image'
import type { WorkSlice } from '../prismic-models'
import ArrowIcon from './ArrowIcon'

const WorkSlice = ({ slice, index }: SliceComponentProps<WorkSlice>) => {
  const randomDeg = () => {
    return (Math.random() - 0.5) * 14
  }

  const [activeImage, setActiveImage] = useState<number>(-1)
  const [deg, setDeg] = useState(0)

  useEffect(() => {
    setDeg(randomDeg())
  }, [activeImage])

  const handleActiveImage = (e: any) => {
    e.stopPropagation()
    let activeNum: number = parseInt(
      e.target.closest('[data-index]')?.dataset?.index ?? '-1'
    )
    setActiveImage(activeNum)
  }

  return (
    <div className="flex justify-between gap-x-4" data-index={index}>
      <div
        className="flex justify-start gap-x-4 md:w-1/2 md:gap-x-5"
        onMouseEnter={(e) => handleActiveImage(e)}
        onMouseLeave={() => setActiveImage(-1)}
      >
        {slice.primary.date && (
          <time
            dateTime={asDate(slice.primary.date).toString()}
            className="mt-[2px] md:mt-[6px]"
          >
            {slice.primary.date.replace(/-/g, '/')}
          </time>
        )}
        <div>
          <div className="[&>*]:!text-[20px] md:[&>*]:!text-[24px]">
            {slice.primary.title && <h3>{slice.primary.title[0]?.text}</h3>}
          </div>
          {slice.primary.role && (
            <p className="mb-4 text-sm">{slice.primary.role}</p>
          )}
          {slice.primary.link && (
            <PrismicLink
              field={slice.primary.link}
              className="group relative flex items-center gap-x-2 text-sm text-v-red [&>svg]:w-[10px] [&>svg]:fill-v-red [&>svg]:duration-[200ms] md:[&>svg]:hover:translate-x-1 md:[&>svg]:hover:-translate-y-1"
            >
              <span className='relative before:absolute before:-bottom-1 before:left-0 before:block before:h-[1px] before:w-full before:origin-top-left before:scale-0 before:bg-v-red before:duration-[400ms] before:content-[""] md:group-hover:before:scale-100'>
                VISIT WEBSITE
              </span>
              <ArrowIcon />
            </PrismicLink>
          )}
        </div>
      </div>
      {isFilled.imageThumbnail(slice.primary.Thumbnail) && (
        <div
          className={`absolute top-0 -right-6 hidden w-1/2 transition-all duration-[400ms] md:block ${
            index === activeImage ? 'z-10 scale-[1.16]' : 'z-0'
          }`}
        >
          <Image
            src={slice.primary.Thumbnail?.url ?? ''}
            alt={slice.primary.Thumbnail.alt ?? 'WORK THUMBNAIL'}
            fill
            className="aspect-[5/3] max-h-[40vh] w-full object-cover drop-shadow-md"
            style={{ transform: `rotate(${deg}deg)` }}
          />
        </div>
      )}
    </div>
  )
}

export default WorkSlice
