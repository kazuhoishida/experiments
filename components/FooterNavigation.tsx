import { PrismicLink, PrismicText } from "@prismicio/react"
import { asText } from "@prismicio/richtext"
import type { PropsWithChildren } from "react"
import type { NavigationDocument } from "../prismic-models"

type Props = {
  nav: NavigationDocument
}

const NavItem = ({ children }: PropsWithChildren) => {
  return (
    <li className="">{children}</li>
  )
}

const FooterNavigation = ({nav}: Props) => {
  return nav && (
    <div className="fixed bottom-[2vh] left-1/2 -translate-x-1/2">
      <ul
        className={`
          flex justify-between gap-x-[42px] px-6 py-1
          font-serif text-sm text-white bg-[#565656]/60 backdrop-blur-sm rounded-sm drop-shadow-md
        `}
      >
        <NavItem>
          <PrismicLink href="/">
            <PrismicText field={nav.data.homepageLabel} />
          </PrismicLink>
        </NavItem>
        {nav.data.links.map(item => (
          <NavItem key={asText(item.label)}>
            <PrismicLink field={item.link}>
              <PrismicText field={item.label} />
            </PrismicLink>
          </NavItem>
        ))}
      </ul>
    </div>
  )
}

export default FooterNavigation
