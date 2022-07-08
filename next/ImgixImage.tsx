import { ImgixLoader } from './ImgixLoader'
import FutureImage from 'next/future/image'
import type { ImageProps } from 'next/future/image'

type Props = Omit<ImageProps, 'loader'>

const ImgixImage = (props: Props) => {
  return <FutureImage {...props} loader={ImgixLoader} />
}
export default ImgixImage
