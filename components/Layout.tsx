import type { PropsWithChildren } from 'react'
import type { NavigationDocument, SettingsDocument } from '../prismic-models'
import { Header } from "./Header"

type Props = PropsWithChildren & {
  nav: NavigationDocument<string>
  className?: string
}

export function Layout({ nav, children, className, }: Props) {
  console.dir(nav)
  return (
    <div className={`text-black ${className}`}>
      <Header nav={nav} />
      {children}
    </div>
  )
}
