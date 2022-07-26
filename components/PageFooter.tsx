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
    <footer className={`mb-8 ${ pathname === '/' ? 'hidden' : 'block' }`}>
      <div className="px-8 md:p-0 md:w-9/10 mx-auto">
        <div className="w-full h-px bg-black"></div>
      </div>
      <div className='md:w-9/10 md:mx-auto md:flex md:justify-between md:gap-x-4 md:items-center'>
        <div className='md:flex md:justify-start md:gap-x-4 md:items-center'>
          <div className="w-full md:w-auto flex place-content-center my-8">
            <Logo />
          </div>
          <ul
            className={`w-4/5 mx-auto flex justify-between md:justify-start md:gap-x-8 mb-8 md:m-0 px-12 py-2 font-serif text-sm`}
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
        </div>
        <div className="w-full flex place-content-center md:place-content-end font-serif text-xs">anice lab all rights reserved.</div>
      </div>
    </footer>
  )
}
