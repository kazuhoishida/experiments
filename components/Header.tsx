import { asText, isFilled } from "@prismicio/helpers"
import { Dialog, Transition } from '@headlessui/react'
import { FeaturedProjectsAtom } from "../stores"
import { Fragment, useEffect, useState } from 'react'
import { Logo } from "./Logo"
import { PrismicLink, PrismicText } from "@prismicio/react"
import { useAtomValue } from 'jotai/utils'
import clsx from 'clsx'
import Image from 'next/image'
import type { FeaturedProject } from '../fetches/featuredProject'
import type { NavigationDocument } from '../prismic-models'
import { useRouter } from 'next/router'
import Bubble from './Bubble'
import { BubbleAtom } from "../stores/BubbleAtom"
import { useUpdateAtom } from 'jotai/utils'
import CubeIcon from '../components/CubeIcon'

type Props = {
  nav: NavigationDocument
}

type NavItemProps = {
  children: any
  item: any
}

const NavItem = ({ item, children }: NavItemProps) => {
  const setBubbleThumb = useUpdateAtom(BubbleAtom)
  const setThumbnail = () => {
    if (item == undefined) return
    if(isFilled.linkToMedia(item.data?.featuredMedia)) {
      setBubbleThumb(item.data?.featuredMedia?.url ?? '')
    }
  }
  return (
    <li className="font-[640] text-[36px] leading-none md:hover:opacity-50 md:hover:translate-x-4 duration-[300ms]" onMouseEnter={setThumbnail}>{children}</li>
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
    <div className="flex flex-col gap-y-[30px] md:gap-y-[7vh] z-[1] md:w-1/2">
      <nav className="text-white font-flex font-bold-h1">
        <ul className="flex flex-col justify-center gap-y-[30px]">
          <li className="font-[640] text-[36px] leading-none md:hover:opacity-50 md:hover:translate-x-4 duration-[300ms]">
            <PrismicLink href="/" className="outline-0">
              <PrismicText field={nav.data.homepageLabel} />
            </PrismicLink>
          </li>
          {nav.data.links.map(item => (
            <NavItem key={asText(item.label)} item={item}>
              <PrismicLink field={item.link} className="outline-0">
                <PrismicText field={item.label} />
              </PrismicLink>
            </NavItem>
          ))}
        </ul>
      </nav>
      <nav className="text-black font-flex font-bold-h1">
        <ul className="flex flex-col justify-center gap-y-[30px]">
          {featuredProjects?.data.projects.map(({project}) => isFilled.contentRelationship(project) && (
            <NavItem key={project.id} item={project}>
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
  const [isWide, setWide] = useState(false)
  useEffect(() => {
    setWide(window.screen.width >= 768)
    
    const handleResize = () => {
      setWide(window.screen.width >= 768)
    }
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize);
  }, [])

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
        <div className="fixed inset-0">
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
              <Dialog.Panel className="w-screen h-[calc(var(--vh,_1vh)_*_100)] transform overflow-hidden text-left align-middle shadow-xl transition-all">
                <div className={clsx('bg-v-dark-gray transition-all delay-300 w-full h-full px-[10vw] md:pl-[10vw] md:pr-0', {'opacity-0': !isOpen})}>
                  <div className="h-full py-[10vh] overflow-y-auto no-scrollbar">
                    <Navigation nav={nav} />
                  </div>
                </div>
                {isWide && (
                  <div className="fixed top-0 right-0 w-1/2 h-[calc(var(--vh,_1vh)_*_100)] hidden md:block z-0 cursor-grab">
                    <Bubble />
                  </div>
                )}
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
  }, [router.asPath])
  const toggleMenu = () => toggle(!isOpen)
  return (
    <header className="sticky top-0 left-0 px-4 py-2 w-full flex justify-between items-center z-50">
      <Logo />
      <div className="relative w-16 h-16 hover:cursor-pointer" onClick={toggleMenu}>
        <CubeIcon />
      </div>
      <MenuModal nav={nav} isOpen={isOpen} />
    </header>
  )
}
