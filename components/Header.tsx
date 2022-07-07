import { asText, isFilled } from "@prismicio/helpers"
import { Dialog, Transition } from '@headlessui/react'
import { FeaturedProjectsAtom } from "../stores"
import { Fragment, useEffect, useState } from 'react'
import { Logo } from "./Logo"
import { PrismicLink, PrismicText } from "@prismicio/react"
import { useAtomValue } from 'jotai/utils'
import clsx from 'clsx'
import Image from 'next/image'
import type { FeaturedProject, FeaturedProjects } from '../fetches/featuredProject'
import type { NavigationDocument } from '../prismic-models'
import type { PropsWithChildren } from 'react'
import { useRouter } from 'next/router'

type Props = {
  nav: NavigationDocument
}

const NavItem = ({ children }: PropsWithChildren) => {
  return (
    <li className="font-[640] text-[36px] leading-none">{children}</li>
  )
}

type FeaturedProjectProps = {
  project: FeaturedProject
}

const FeaturedProjectItem = ({project}: FeaturedProjectProps) => {
  if( !isFilled.contentRelationship(project) || !isFilled.contentRelationship(project.data?.creator) ) {
    return <></>
  }
  const name = project.data?.creator?.data?.name
  return (
    <div className="flex flex-col md:flex-row md:items-center md:gap-x-3">
      <div className="text-[36px] whitespace-nowrap">{project.data?.title}</div>
      <div className="hidden md:block md:w-24 md:h-px md:bg-black shrink-0"></div>
      <div className="text-[20px] whitespace-nowrap"><>{name}</></div>
    </div>
  )
}

const Navigation = ({nav}: Props) => {
  const featuredProjects = useAtomValue(FeaturedProjectsAtom)
  return nav && (
    <div className="flex flex-col gap-y-[30px] z-[1]">
      <nav className="text-white font-flex font-bold-h1">
        <ul className="flex flex-col justify-center gap-y-[30px]">
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
      <nav className="text-black font-flex font-bold-h1">
        <ul className="flex flex-col justify-center gap-y-[30px]">
          {featuredProjects?.data.projects.map(({project}, no) => isFilled.contentRelationship(project) && (
            <NavItem key={no}>
              <PrismicLink field={project} className="outline-0">
                <FeaturedProjectItem project={project} />
              </PrismicLink>
            </NavItem>
          ))}
        </ul>
      </nav>
    </div>
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
                <div className={clsx('bg-[#D2D2D2] transition-all delay-300 w-full h-full pl-[29px] md:pl-40 pt-28', {'opacity-0': !isOpen})}>
                  <div className="contents md:grid md:grid-cols-2">
                    <Navigation nav={nav} />
                    <div className="relative hidden md:block z-0">
                      <Image src="https://images.prismic.io/nextjs-starter-blog-myzt/3f6c62e2-0788-44ba-9b6b-a80fd0ff48fd_bubbles.png?auto=compress,format" alt="あわわわわ" layout="fixed" width={719} height={691} />
                    </div>
                  </div>
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
  const router = useRouter()
  const [isOpen, toggle] = useState(false)
  useEffect(() => {
    toggle(false)
  }, [router.query.slug])
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
