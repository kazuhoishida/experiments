import { type PropsWithChildren, useEffect, useState } from 'react'
import type { NavigationDocument } from '../prismic-models'
import { Header } from './Header'
import { PageFooter } from './PageFooter'

type Props = PropsWithChildren & {
  nav: NavigationDocument
  className?: string
}

export function Layout({ nav, children, className }: Props) {
  const [pathname, setPathname] = useState<string>()
  useEffect(() => {
    typeof window === 'object' && setPathname(window.location.pathname)
  }, [])

  return (
    <div
      className={`min-h-screen text-black [min-height:100svh] ${
        pathname === '/creators' && 'bg-v-light-gray'
      } ${className}`}
    >
      <Header nav={nav} />
      {children}
      <PageFooter nav={nav} />
    </div>
  )
}
