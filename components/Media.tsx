import Image from 'next/image'
import type { FilledLinkToMediaField } from '@prismicio/types'

export const Media = ({field}: {field: FilledLinkToMediaField}) => {
  if( field.link_type !== 'Media' ) {
    return <></>
  }
  if( field.kind === 'image' ) {
    return (
      <div className="relative w-full h-[50vh]">
        <Image src={field.url} alt={field.name} layout="fill" objectFit="contain" />
      </div>
    )
  } else {
    return <>not image</>
  }
}
