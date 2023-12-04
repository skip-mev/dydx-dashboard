import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="dark" lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta content="ie=edge" httpEquiv="X-UA-Compatible" />
      </Head>
      <body className="bg-dydx-bg text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
