type Props = {
  isVisible: boolean
  position: {
    x: number
    y: number
  }
}

const Cursor = ({isVisible, position}: Props) => {
  return (
    <div
      className={`
        absolute top-[var(--cursor-y)] left-[var(--cursor-x)] ${isVisible ? 'scale-100' : 'scale-0'}
        hidden md:flex place-items-center place-content-center
        font-flex font-squash-h4 text-[17px]
        w-40 h-40 translate-x-[-4rem] translate-y-[-4rem] rounded-full overflow-hidden
        transition-transform duration-[400ms] backdrop-invert pointer-events-none
      `}
      style={{
        '--cursor-x': `${position.x - 24}px`,
        '--cursor-y': `${position.y - 28}px`,
        'text-stroke': '1px #666',
        '-webkit-text-stroke': '1px #666'
      }}
    >VIEW</div>
  )
}

export default Cursor
