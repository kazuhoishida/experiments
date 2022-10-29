import { useState, useEffect } from "react"
import { PrismicLink } from "@prismicio/react"

export const Logo = () => {
  const [pathname, setPathname] = useState<string>()
  useEffect(() => {
    typeof window === "object" && setPathname(window.location.pathname)
  }, [])
  return (
    <PrismicLink href="/" className={`${pathname === "/" ? "invisible" : "visible"}`}>
      <h1 className="w-fit text-[32px] font-bold leading-none">LAB</h1>
    </PrismicLink>
  )
}
