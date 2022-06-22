import type { PropsWithChildren } from 'react'
import type { NavigationDocument, SettingsDocument } from '../prismic-models'
import { Header } from "./Header";
import { Footer } from "./Footer";

type Props = PropsWithChildren & {
  nav: NavigationDocument<string>
}

export function Layout({ nav, children, }: Props) {
  return (
    <div className="text-slate-700">
      <Header nav={nav} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
