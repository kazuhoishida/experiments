const FooterNavigation = () => {
  return (
    <div className="fixed bottom-[2vh] left-1/2 -translate-x-1/2">
      <ul
        className={`
          flex justify-between gap-x-[42px] px-6 py-1
          font-serif text-sm text-white bg-[#565656]/60 backdrop-blur-sm rounded-sm drop-shadow-md
        `}
      >
        <li className="font-bold">Home</li>
        <li>Projects</li>
        <li>Creators</li>
      </ul>
    </div>
  )
}

export default FooterNavigation
