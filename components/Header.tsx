import clsx from 'clsx'
import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { Bounded } from "./Bounded"
import { Logo } from "./Logo"
import type { NavigationDocument } from '../prismic-models'
import { asText } from "@prismicio/helpers";
import { PrismicLink, PrismicText } from "@prismicio/react";

type Props = {
  nav: NavigationDocument<string>
}

const NavItem = ({ children }: PropsWithChildren) => {
  return (
    <li className="font-[640] text-[36px] leading-none">{children}</li>
  )
}

const Navigation = ({nav}: Props) => {
  return nav && (
    <nav className="z-40 text-white font-flex font-bold-h1">
      <ul className="flex flex-col justify-center gap-[30px]">
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
    </nav>
  )
}

export function Header({ nav, }: Props) {
  const [isOpen, toggle] = useState(false)
  const toggleMenu = () => toggle(!isOpen)
  return (
    <Bounded as="header">
      <div className="relative md:fixed md:top-0 md:left-0 md:w-full flex justify-between z-50">
        <Logo />
        <div className="relative w-9 h-9">
          <Image onClick={toggleMenu} src="http://localhost:38888/cube.png" alt="MENU" layout="fill" objectFit="contain" />
        </div>
        <div className={clsx('fixed z-[-1] inset-0', {'hidden': !isOpen})}>
          <div className={clsx('bg-[#D2D2D2] transition-all delay-300 w-full h-full pl-[29px] pt-28', {'opacity-0': !isOpen})}>
            <Navigation nav={nav} />
          </div>
        </div>
      </div>
    </Bounded>
  )
}
