import "@/styles/globals.css";
import "@fontsource-variable/inconsolata";
import "@fontsource-variable/inter";

import Layout from "@/components/Layout";
import { queryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Layout id="main" className="font-sans">
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
      <Analytics />
    </>
  );
}
