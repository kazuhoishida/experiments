import { type PropsWithChildren, useEffect } from 'react'
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

  return (
    <div className={`text-black ${className}`}>
      <Header nav={nav} />
      {children}
      <PageFooter nav={nav} />
    </div>
  )
}
