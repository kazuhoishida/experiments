import { isFilled } from "@prismicio/helpers"
import { PrismicLink, PrismicText } from "@prismicio/react"
import { asText } from "@prismicio/richtext"
import { Provider } from 'jotai'
import { useAtomValue } from 'jotai/utils'
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
      <div className="fixed bottom-[3vh] left-1/2 -translate-x-1/2 z-50">
        <ul
          className={`
            flex justify-between gap-x-[12vw] md:gap-x-[42px] px-8 py-2
            font-serif text-sm text-white bg-v-soft-black/70 backdrop-blur-sm rounded-sm drop-shadow-md
          `}
        >
          <NavItem className={`${ pathname === '/' ? 'font-bold' : '' }`}>
            <PrismicLink href="/">
              <PrismicText field={nav.data.homepageLabel} />
            </PrismicLink>
          </NavItem>
          {nav.data.links.map(item => {
            return (
            <NavItem key={asText(item.label)} className={`${ isCurrent(item) ? 'font-bold' : '' }`}>
              <PrismicLink field={item.link}>
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
