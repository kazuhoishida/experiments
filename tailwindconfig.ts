import type { TailwindConfig } from 'tailwindcss/tailwind-config' // @types/tailwindcssで提供されている古い型
import type { Config } from 'tailwindcss' // tailwindに含まれている新しいConfig型
import twconfig from './tailwind.config' // tailwind.config.js は新しい方に合わせてある
import resolveConfig from 'tailwindcss/resolveConfig' // 新しい型ではresolveConfigがexportされていないため使用できない
import type { ScreensConfig } from 'tailwindcss/types/config'

const resolvedConfig = resolveConfig(twconfig as TailwindConfig) as Config // 古い方に型を合わせてから新しい方に型定義する
export const theme = resolvedConfig.theme
 // defaultConfig.stub.jsで定義済みのため、screensはundefinedにはならない
export const screens = theme!.screens as ScreensConfig

export default resolvedConfig
