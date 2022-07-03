import { useEffect, useState } from "react"

type Props = {
  isVisible: boolean
  position: {
    x: number
    y: number
  }
}

const Cursor = ({isVisible, position}: Props) => {
  const [scale, setScale] = useState(0)
  useEffect(() => {
    setScale(isVisible ? 100 : 0)
  }, [isVisible])
  return (
    <div
      className={`
        absolute top-[var(--cursor-y)] left-[var(--cursor-x)] scale-[var(--cursor-scale)]
        flex place-items-center place-content-center
        font-flex font-squash-h4 text-[17px]
        w-32 h-32 translate-x-[-4rem] translate-y-[-4rem] rounded-full overflow-hidden
        transition-transform duration-[400ms] backdrop-invert pointer-events-none
      `}
      style={{
        '--cursor-x': `${position.x}px`,
        '--cursor-y': `${position.y}px`,
        '--cursor-scale': `${scale}%`,
      }}
    >VIEW</div>
  )
}

export default Cursor
