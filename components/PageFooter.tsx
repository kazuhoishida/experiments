import { useState, useEffect, InputHTMLAttributes, PropsWithChildren } from "react"
import { PrismicLink, PrismicText } from "@prismicio/react"
import type { NavigationDocument } from "../prismic-models"
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
    <footer id="page-footer" className={`hidden pb-4 ${pathname === "/" ? "hidden" : "!block"}`}>
      <div className="md:mx-auto md:flex md:w-9/10 md:items-center md:justify-between md:gap-x-4">
        <div className="md:flex md:items-center md:justify-start md:gap-x-4">
          <ul className={`mx-auto mb-8 flex w-4/5 justify-between px-12 py-2 font-serif text-sm md:m-0 md:w-auto md:justify-start md:gap-x-8 md:px-0`}>
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
        <div className="flex w-full place-content-center font-serif text-[8px] md:place-content-end">K. Ishida All Rights Reserved.</div>
      </div>
    </footer>
  )
}
