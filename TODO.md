# リファクタ TODO

## P0（最優先: バグ/副作用/型の危険）

- [ ] `pages/projects/[uid].tsx`: レンダー中のアトム更新を `useEffect` に移動（`FeaturedProjectsAtom`）。
- [ ] `pages/projects/[uid].tsx`: `router.prefetch('/projects')` に依存配列を追加（`[]` もしくは `[router]`）。
- [ ] `pages/projects/[uid].tsx`: 残存 `console.log` を削除。
- [ ] `pages/projects/[uid].tsx`, `pages/index.tsx`, `components/Heading.tsx`, `components/Bounded.tsx`, `prismicio.ts`: `any` / `as any` の削減。`getStaticProps`/`getStaticPaths` の型付け、`React.ElementType` への置換、`createClient` の引数型見直し。

## P1（高: 再利用性/安全性/UX 安定）

- [ ] 画像表示の重複排除: `[uid].tsx` 内のローカル `Media` を削除し、`components/Media.tsx` に集約（必要プロップを拡張）。
- [ ] `pages/projects/index.tsx`: GSAP のグローバルセレクタ（`.project-card`）依存を `ref` ベースにスコープ化、実行タイミングを初回/依存に限定。
- [ ] `pages/projects/index.tsx`: リスト `key` を安定値に変更（`project.id` もしくは `project.uid`）。
- [ ] `pages/projects/[uid].tsx`: `dangerouslySetInnerHTML` の不要使用を通常レンダーへ置換（プレーンテキスト箇所のみ）。
- [ ] `pages/**/*.tsx`: `next/image` 使用箇所に `sizes` を付与し CLS/レスポンシブ最適化。

## P2（中: API 設計/整合性）

- [ ] `prismicio.ts`: `createClient(config)` の型付けと `prismic.createClient` への `...config` 伝播。`previewData` を正しく扱う。
- [ ] `pages/projects/[uid].tsx`: `getStaticPaths` を `{ params: { uid } }` 形式で返す実装へ変更（`asLink` 依存を回避）。
- [ ] `pages/_document.tsx`: Google Fonts の `crossOrigin` を `"anonymous"` に明示。

## P3（低〜中: 保守性/一貫性）

- [ ] `utils/prismic.ts`: `getTextFromField` の型付け（Prismic の RichText 型を使用）。
- [ ] `components/Select.tsx`: `ALL` ラベル変換ロジックの切り出し/一貫化。
- [ ] Tailwind 設定: `fontFamily` の `null` 指定の意図を整理し記述を明示。

## 参考（実装時のポイント）

- 既存の API/挙動は維持しつつ、型安全性と副作用の最小化を優先。
- 画像は `output: 'export'` に合わせた最適化方針を明確化（`unoptimized` の是非を再確認）。
- `dangerouslySetInnerHTML` は本当に HTML のみで使用し、テキストは通常レンダーへ。
