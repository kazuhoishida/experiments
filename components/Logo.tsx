import { useState, useEffect } from 'react'
import { PrismicLink } from "@prismicio/react";

export const Logo = () => {
  const [pathname, setPathname] = useState<string>()
  useEffect(() => {
    typeof window === 'object' && setPathname(window.location.pathname)
  },[])
  return (
    <PrismicLink href="/" className={`${ pathname === '/' ? 'invisible' : 'visible' }`}>
      <h1
        className="w-fit font-rock text-[36px] leading-none tracking-[-0.19em]"
      >
        LAB
      </h1>
    </PrismicLink>
  )
}
