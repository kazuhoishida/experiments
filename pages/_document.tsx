import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Roboto+Flex:opsz,wdth,wght@8..144,32,640;8..144,100,400;8..144,140,800&family=Roboto+Serif:opsz@8..144&family=Rock+3D&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="max-w-[100vw] overflow-x-hidden antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
