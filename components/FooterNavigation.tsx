import { isFilled } from "@prismicio/helpers"
import { PrismicLink, PrismicText } from "@prismicio/react"
import { asText } from "@prismicio/richtext"
import { Provider } from 'jotai'
import { InputHTMLAttributes, PropsWithChildren, useEffect, useState } from "react"
import type { NavigationDocument, NavigationDocumentDataLinksItem, Simplify } from "../prismic-models"

type NavItemProps = PropsWithChildren & InputHTMLAttributes<HTMLLIElement>

const NavItem = ({ children, className }: NavItemProps) => {
  return (
    <li className={className}>{children}</li>
  )
}

type Props = {
  nav: NavigationDocument
}
const FooterNavigation = ({nav}: Props) => {
  const [pathname, setPathname] = useState<string>()
  useEffect(() => {
    typeof window === 'object' && setPathname(window.location.pathname)
  },[])
  const isCurrent = (navItem: Simplify<NavigationDocumentDataLinksItem>) => (
    isFilled.contentRelationship(navItem.link) && navItem.link.url === pathname
  )
  return nav && (
    <Provider>
      <div className="fixed bottom-[2.5vh] left-1/2 -translate-x-1/2 z-30">
        <ul
          className={`
            flex justify-between gap-x-[12vw] md:gap-x-[42px] px-8 py-3
            font-serif text-sm text-white bg-v-soft-black/70 backdrop-blur-sm rounded-sm drop-shadow-md
            md:hover:bg-black/70 duration-[400ms]
          `}
        >
          <NavItem className={`relative md:hover:font-bold ${ pathname === '/' ? 'font-bold' : '' }`}>
            <PrismicLink href="/" className='before:content-[""] before:block before:w-full before:h-[1px] before:bg-white before:absolute before:-bottom-1 before:left-0 before:origin-top-left before:scale-0 md:hover:before:scale-100 before:duration-[400ms]'>
              <PrismicText field={nav.data.homepageLabel} />
            </PrismicLink>
          </NavItem>
          {nav.data.links.map(item => {
            return (
            <NavItem key={asText(item.label)} className={`relative md:hover:font-bold ${ isCurrent(item) ? 'font-bold' : '' }`}>
              <PrismicLink field={item.link} className='before:content-[""] before:block before:w-full before:h-[1px] before:bg-white before:absolute before:-bottom-1 before:left-0 before:origin-top-left before:scale-0 md:hover:before:scale-100 before:duration-[400ms]'>
                <PrismicText field={item.label} />
              </PrismicLink>
            </NavItem>
          )})}
        </ul>
      </div>
    </Provider>
  )
}

export default FooterNavigation
