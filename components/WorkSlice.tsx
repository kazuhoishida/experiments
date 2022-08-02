import { useState, useEffect } from 'react'
import { type SliceComponentProps, PrismicLink } from '@prismicio/react'
import { asDate, isFilled } from '@prismicio/helpers'
import FutureImage from '../next/ImgixImage'
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
    let activeNum: number = parseInt(e.target.closest('[data-index]')?.dataset?.index ?? '-1')
    setActiveImage(activeNum)
  }

  return (
    <div className='flex gap-x-4 justify-between' data-index={index}>
      <div className='flex justify-start gap-x-4 md:gap-x-5 md:w-1/2' onMouseEnter={(e) => handleActiveImage(e)} onMouseLeave={() => setActiveImage(-1)}>
        {slice.primary.date && <time dateTime={asDate(slice.primary.date).toString()} className="mt-[2px] md:mt-[6px]">{ slice.primary.date.replace(/-/g, '/') }</time>}
        <div>
          <div className='[&>*]:!text-[20px] md:[&>*]:!text-[24px]'>
            {slice.primary.title && <h3>{slice.primary.title[0]?.text}</h3>}
          </div>
          {slice.primary.role && <p className='text-sm mb-4'>{ slice.primary.role }</p>}
          {slice.primary.link && <PrismicLink field={slice.primary.link} className='group relative text-v-red flex gap-x-2 items-center [&>svg]:w-[10px] [&>svg]:fill-v-red text-sm [&>svg]:duration-[200ms] md:[&>svg]:hover:translate-x-1 md:[&>svg]:hover:-translate-y-1'><span className='relative before:content-[""] before:block before:w-full before:h-[1px] before:bg-v-red before:absolute before:-bottom-1 before:left-0 before:origin-top-left before:scale-0 md:group-hover:before:scale-100 before:duration-[400ms]'>VISIT WEBSITE</span><ArrowIcon /></PrismicLink>}
        </div>
      </div>
      {isFilled.imageThumbnail(slice.primary.Thumbnail) && (
        <div className={`hidden md:block w-1/2 absolute top-0 -right-6 transition-all duration-[400ms] ${index === activeImage ? 'z-10 scale-[1.16]' : 'z-0'}`}>
          <FutureImage
            src={slice.primary.Thumbnail?.url ?? ''}
            alt={slice.primary.Thumbnail.alt ?? 'WORK THUMBNAIL'}
            className="object-cover w-full aspect-[5/3] max-h-[40vh] drop-shadow-md"
            style={{ transform: `rotate(${deg}deg)` }}
          />
        </div>
      )}
    </div>
  )
}

export default WorkSlice