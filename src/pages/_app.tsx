import { queryClient } from "@/lib/react-query";
import "@/styles/globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Inconsolata, Inter } from "next/font/google";
import { Fragment } from "react";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
        <main
          id="main"
          className={`${inter.variable} ${inconsolata.variable} font-sans`}
        >
          <Component {...pageProps} />
        </main>
      </QueryClientProvider>
      <Analytics />
    </Fragment>
  );
}
