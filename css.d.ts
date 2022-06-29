import type * as CSS from 'csstype'

declare module 'csstype' {
  interface Properties {
    '--scale-x'?: string
    '--visibility'?: string
    '--icon-size'?: string
    '--padding-x'?: string
  }
}
