/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import Card from "@/components/Card";
import Head from "next/head";
import { SearchInput } from "@/components/pages/home/SearchInput";
import { InactiveToggle } from "@/components/pages/home/InactiveToggle";
import { TimeframeSelect } from "@/components/pages/home/TimeframeSelect";
import { SortBySelect } from "@/components/pages/home/SortBySelect";
import { SortOrderButton } from "@/components/pages/home/SortOrderButton";
import { ValidatorsTable } from "@/components/pages/home/ValidatorsTable";
import { MainChart } from "@/components/pages/home/MainChart";
import { MainChartToggles } from "@/components/pages/home/MainChartToggles";
import { useIsFetching } from "@tanstack/react-query";
import { ValidatorLoadingIndicator } from "@/components/pages/home/ValidatorLoadingIndicator";

export default function Home() {
  const isChartLoading = useIsFetching({
    queryKey: ["USE_MAIN_CHART_DATA"],
  });

  return (
    <>
      <Head>
        <title>dYdX MEV Dashboard | Skip</title>
      </Head>
      <ValidatorLoadingIndicator />
      <div className="py-12 space-y-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="space-y-5">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <img className="h-8" src="/dydx-logo.svg" alt="" />
              <span className="text-4xl leading-[32px] font-black">/</span>
              <img className="h-8" src="/skip-logo.svg" alt="" />
            </div>
            <p className="font-mono font-bold text-xl text-center md:text-start">
              Orderbook Discrepancy
            </p>
          </div>
        </div>
        <div>
          <Card
            className={`p-3 md:p-6 rounded-none md:rounded-lg ${
              isChartLoading ? "animate-pulse" : null
            }`}
          >
            <div className="relative">
              {isChartLoading ? (
                <div className="h-[300px] w-full" />
              ) : (
                <Fragment>
                  <div className="[writing-mode:vertical-lr] rotate-180 font-mono text-xs absolute left-0 top-0 h-[300px] text-center">
                    Cumulative Orderbook Discrepancy ($)
                  </div>
                  <MainChart />
                  <p className="font-mono text-center text-sm pt-4">
                    Past Proposed Blocks
                  </p>
                  <MainChartToggles className="flex justify-center gap-2 flex-wrap pt-8 h-full max-h-32 md:max-h-full overflow-hidden" />
                </Fragment>
              )}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <p className="font-mono font-bold text-xl text-center md:text-start">
              Validators
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start flex-col md:flex-row">
            <div className="flex items-center justify-between gap-4">
              <SearchInput />
            </div>
            <div className="flex-1 flex items-center justify-center md:justify-end gap-4 flex-wrap max-w-sm md:max-w-none px-2">
              <div className="flex items-center gap-1">
                <label className="text-sm text-white/50" htmlFor="hideInactive">
                  Exclude inactive validators:
                </label>
                <InactiveToggle />
              </div>
              <div className="flex items-center gap-1">
                <p className="text-sm text-white/50">Timeframe:</p>
                <TimeframeSelect />
              </div>
              <div className="flex items-center gap-1">
                <p className="text-sm text-white/50">Sort By:</p>
                <SortBySelect />
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm text-white/50">Direction:</p>
                <SortOrderButton />
              </div>
            </div>
          </div>
        </div>
        <div>
          <ValidatorsTable />
        </div>
      </div>
    </>
  );
}
