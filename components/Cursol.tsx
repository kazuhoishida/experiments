import { useEffect, useState } from "react"

type Props = {
  isVisible: boolean
  position: {
    x: number
    y: number
  }
}

const Cursol = ({isVisible, position}: Props) => {
  const [scale, setScale] = useState(0)
  useEffect(() => {
    setScale(isVisible ? 100 : 0)
  }, [isVisible])
  return (
    <div
      className={`
        absolute top-[var(--cursol-y)] left-[var(--cursol-x)] scale-[var(--cursol-scale)]
        flex place-items-center place-content-center
        font-flex font-squash-h4 text-[17px]
        w-32 h-32 translate-x-[-4rem] translate-y-[-4rem] rounded-full overflow-hidden
        transition-transform duration-[400ms] backdrop-invert pointer-events-none cursor-none
      `}
      style={{
        '--cursol-x': `${position.x}px`,
        '--cursol-y': `${position.y}px`,
        '--cursol-scale': `${scale}%`,
      }}
    >VIEW</div>
  )
}

export default Cursol
