import { type PropsWithChildren, useEffect, useState } from 'react'
import type { NavigationDocument } from '../prismic-models'
import { Header } from "./Header"
import { PageFooter } from "./PageFooter"

type Props = PropsWithChildren & {
  nav: NavigationDocument
  className?: string
}

export function Layout({ nav, children, className, }: Props) {
  useEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, [])

  const [pathname, setPathname] = useState<string>()
  useEffect(() => {
    typeof window === 'object' && setPathname(window.location.pathname)
  },[])

  return (
    <div className={`text-black min-h-[calc(var(--vh,_1vh)_*_100)] ${pathname === '/creators' && 'bg-v-light-gray'} ${className}`}>
      <Header nav={nav} />
      {children}
      <PageFooter nav={nav} />
    </div>
  )
}
