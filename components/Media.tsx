import Image, { type ImageProps } from 'next/image'
import type { FilledLinkToMediaField } from '@prismicio/types'

type Props = Partial<ImageProps> & {
  field: FilledLinkToMediaField
  className?: string
}

export const Media = ({ field, className = 'w-full h-[50vh]' }: Props) => {
  if (field.link_type !== 'Media') {
    return <></>
  }
  if (field.kind === 'image') {
    const ratio = 'auto'
    return (
      <div
        className={`relative aspect-[var(--img-ratio)] ${className}`}
        style={{ '--img-ratio': `${ratio}` }}
      >
        <Image
          src={field.url}
          alt={field.name}
          fill
          className="object-cover"
          {...(field.url.match(/.gif/) && { unoptimized: true })}
        />
      </div>
    )
  } else {
    return <>not image</>
  }
}
