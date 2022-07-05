import clsx from 'clsx'
import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { Logo } from "./Logo"
import type { NavigationDocument } from '../prismic-models'
import { asText } from "@prismicio/helpers"
import { PrismicLink, PrismicText } from "@prismicio/react"

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

type Props = {
  nav: NavigationDocument
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
          <PrismicLink href="/" className="outline-0">
            <PrismicText field={nav.data.homepageLabel} />
          </PrismicLink>
        </NavItem>
        {nav.data.links.map(item => (
          <NavItem key={asText(item.label)}>
            <PrismicLink field={item.link} className="outline-0">
              <PrismicText field={item.label} />
            </PrismicLink>
          </NavItem>
        ))}
      </ul>
    </nav>
  )
}

type MenuModalProps = {
  nav: NavigationDocument
  isOpen: boolean
}

const MenuModal = ({nav, isOpen}: MenuModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={()=>{}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-screen h-screen transform overflow-hidden text-left align-middle shadow-xl transition-all">
                <div className={clsx('bg-[#D2D2D2] transition-all delay-300 w-full h-full pl-[29px] pt-28', {'opacity-0': !isOpen})}>
                  <Navigation nav={nav} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export function Header({ nav, }: Props) {
  const [isOpen, toggle] = useState(false)
  const toggleMenu = () => toggle(!isOpen)
  return (
    <header className="sticky top-0 left-0 p-4 w-full flex justify-between z-50">
      <Logo />
      <div className="relative w-9 h-9 drop-shadow">
        <Image onClick={toggleMenu} src="http://localhost:38888/cube.png" alt="MENU" layout="fill" objectFit="contain"/>
      </div>
      <MenuModal nav={nav} isOpen={isOpen} />
    </header>
  )
}
