type Props = {
  className?: string
  width?: number
  height?: number
}

const FilterIcon = ({className='aspect-1', width=25, height=25}: Props) => {
  return (
    <svg
      className={`${className}`}
      width={width} height={height} viewBox="0 0 25 17" fill="none" stroke="white" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <line x1="8.74228e-08" y1="2.44824" x2="10.3448" y2="2.44824"/>
      <line x1="18.5352" y1="2.44824" x2="25.0007" y2="2.44824"/>
      <circle cx="15.9489" cy="3.01724" r="2.01724"/>
      <line x1="25" y1="13.9312" x2="14.6552" y2="13.9312"/>
      <line x1="6.46484" y1="13.9312" x2="-0.000673683" y2="13.9312"/>
      <circle cx="9.05112" cy="13.3622" r="2.01724"/>
    </svg>
  )
}

export default FilterIcon
