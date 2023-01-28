import type { SliceComponentProps } from '@prismicio/react'
import type { VideoSlice } from '../prismic-models'
import { isFilled } from '@prismicio/helpers'

const VideoSlice = ({ slice }: SliceComponentProps<VideoSlice>) => {
  if (!isFilled.linkToMedia(slice.primary.link)) {
    return <></>
  }
  const link = slice.primary.link
  const url = link.url
  const regex = /.+\.(mp4|mov|webm)$/g
  if (link.link_type !== 'Media' || !url.match(regex)) {
    return <></>
  }
  return <video src={url} controls></video>
}

export default VideoSlice
