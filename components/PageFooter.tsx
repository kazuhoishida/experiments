import { useState, useEffect, InputHTMLAttributes, PropsWithChildren } from 'react'
import { PrismicLink, PrismicText } from "@prismicio/react"
import type { NavigationDocument } from '../prismic-models'
import { Bounded } from "./Bounded"
import { Logo } from "./Logo"
import { asText } from '@prismicio/richtext'

type ProjectProps = {
  nav: NavigationDocument
}

type NavItemProps = PropsWithChildren & InputHTMLAttributes<HTMLLIElement>

const NavItem = ({ children, className }: NavItemProps) => {
  return (
    <li className={className}>{children}</li>
  )
}

export const PageFooter = ({nav}: ProjectProps) => {
  const [pathname, setPathname] = useState<string>()
  useEffect(() => {
    typeof window === 'object' && setPathname(window.location.pathname)
  },[])

  return (
    <Bounded as="footer" className={`${ pathname === '/' ? 'hidden' : 'block' }`}>
          <div className="px-4">
            <div className="w-full h-px bg-black"></div>
          </div>
          <div className="h-8"></div>
          <div className="w-full flex place-content-center">
            <Logo />
          </div>
          <div className="h-8"></div>
          <ul
            className={`
              w-full flex justify-between px-12 py-2 font-serif text-sm
            `}
          >
            <NavItem>
              <PrismicLink href="/">
                <PrismicText field={nav.data.homepageLabel} />
              </PrismicLink>
            </NavItem>
            {nav.data.links.map(item => {
              return (
              <NavItem key={asText(item.label)}>
                <PrismicLink field={item.link}>
                  <PrismicText field={item.label} />
                </PrismicLink>
              </NavItem>
            )})}
          </ul>
          <div className="h-8"></div>
          <div className="w-full flex place-content-center font-serif text-sm">anice lab all rights reserved.</div>
    </Bounded>
  )
}
