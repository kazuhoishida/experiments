import Image, { type ImageProps } from "next/image"
import type { FilledLinkToMediaField } from "@prismicio/types"

type Props = Partial<ImageProps> & {
  field: FilledLinkToMediaField
  className?: string
}

export const Media = ({ field, className = "w-full h-[50vh]" }: Props) => {
  if (field.link_type !== "Media") {
    return <></>
  }
  if (field.kind === "image") {
    const ratio = "auto"
    return (
      <div className={`relative aspect-[var(--img-ratio)] ${className}`} style={{ "--img-ratio": `${ratio}` }}>
        {field.url.endsWith(".gif") ? <img src={field.url} alt={field.name} className="object-cover" /> : <Image src={field.url} alt={field.name} fill className="object-cover" />}
      </div>
    )
  } else {
    return <>not image</>
  }
}
