import { useState, useEffect, InputHTMLAttributes, PropsWithChildren } from "react"
import { PrismicLink, PrismicText } from "@prismicio/react"
import type { NavigationDocument } from "../prismic-models"
import { Logo } from "./Logo"
import { asText } from "@prismicio/richtext"

type ProjectProps = {
  nav: NavigationDocument
}

type NavItemProps = PropsWithChildren & InputHTMLAttributes<HTMLLIElement>

const NavItem = ({ children, className }: NavItemProps) => {
  return <li className={className}>{children}</li>
}

export const PageFooter = ({ nav }: ProjectProps) => {
  const [pathname, setPathname] = useState<string>("/")
  useEffect(() => {
    typeof window === "object" && setPathname(window.location.pathname)
  }, [])

  return (
    <footer id="page-footer" className={`hidden pb-8 ${pathname === "/" ? "hidden" : "!block"}`}>
      <div className="mx-auto px-8 md:w-9/10 md:p-0">
        <div className="h-px w-full bg-black"></div>
      </div>
      <div className="md:mx-auto md:flex md:w-9/10 md:items-center md:justify-between md:gap-x-4">
        <div className="md:flex md:items-center md:justify-start md:gap-x-4">
          <div className="my-8 flex w-full place-content-center md:w-auto">
            <Logo />
          </div>
          <ul className={`mx-auto mb-8 flex w-4/5 justify-between px-12 py-2 font-serif text-sm md:m-0 md:justify-start md:gap-x-8`}>
            <NavItem>
              <PrismicLink
                href="/"
                className='relative before:absolute before:-bottom-1 before:left-0 before:block before:h-[1px] before:w-full before:origin-top-left before:scale-0 before:bg-black before:duration-[400ms] before:content-[""] md:hover:before:scale-100'
              >
                <PrismicText field={nav.data.homepageLabel} />
              </PrismicLink>
            </NavItem>
            {nav.data.links.map((item) => {
              return (
                <NavItem key={asText(item.label)}>
                  <PrismicLink
                    field={item.link}
                    className='relative before:absolute before:-bottom-1 before:left-0 before:block before:h-[1px] before:w-full before:origin-top-left before:scale-0 before:bg-black before:duration-[400ms] before:content-[""] md:hover:before:scale-100'
                  >
                    <PrismicText field={item.label} />
                  </PrismicLink>
                </NavItem>
              )
            })}
          </ul>
        </div>
        <div className="flex w-full place-content-center font-serif text-xs md:place-content-end">all rights reserved.</div>
      </div>
    </footer>
  )
}
