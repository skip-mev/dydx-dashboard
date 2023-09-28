/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect } from "react";
import { useValidatorsWithStatsQuery } from "@/hooks";
import Card from "@/components/Card";
import Head from "next/head";
import { resetSelectedValidators, useHomeStore } from "@/store/home";
import { SearchInput } from "@/components/pages/home/SearchInput";
import { InactiveToggle } from "@/components/pages/home/InactiveToggle";
import { TimeframeSelect } from "@/components/pages/home/TimeframeSelect";
import { SortBySelect } from "@/components/pages/home/SortBySelect";
import { SortOrderButton } from "@/components/pages/home/SortOrderButton";
import { ValidatorsTable } from "@/components/pages/home/ValidatorsTable";
import { MainChart } from "@/components/pages/home/MainChart";
import { MainChartToggles } from "@/components/pages/home/MainChartToggles";
import { useQuery } from "@tanstack/react-query";
import { ValidatorLoadingIndicator } from "@/components/pages/home/ValidatorLoadingIndicator";

export default function Home() {
  const { blocks, selectedValidators, hideInactive } = useHomeStore();

  const { data: validators = [] } = useValidatorsWithStatsQuery({
    blocks,
    select: (arr = []) => {
      if (hideInactive) {
        arr = arr.filter((validator) => validator.stake !== "0");
      }
      return arr;
    },
  });

  useEffect(() => {
    if (validators?.[0] && selectedValidators.length === 0) {
      resetSelectedValidators([validators[0]]);
    }
  }, [selectedValidators, validators]);

  const { isLoading: isChartLoading } = useQuery({
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
            <div className="flex items-center gap-4">
              <img className="h-8" src="/dydx-logo.svg" alt="" />
              <span className="text-4xl leading-[32px] font-black">/</span>
              <img className="h-8" src="/skip-logo.svg" alt="" />
            </div>
            <p className="font-mono font-bold text-xl">Orderbook Discrepancy</p>
          </div>
        </div>
        <div>
          <Card
            className={`p-6 pr-4 ${isChartLoading ? "animate-pulse" : null}`}
          >
            <div className="relative">
              {isChartLoading ? (
                <div className="h-[300px] w-full" />
              ) : (
                <Fragment>
                  <div className="absolute -rotate-90 translate-y-[130px] -translate-x-[110px] font-mono text-xs">
                    Cumulative Orderbook Discrepancy ($)
                  </div>
                  <MainChart />
                  <p className="font-mono text-center text-sm pt-4">
                    Past Proposed Blocks
                  </p>
                  <MainChartToggles className="flex justify-center gap-2 flex-wrap pt-8" />
                </Fragment>
              )}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-end gap-4">
              <p className="font-mono font-bold text-xl">Validators</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-between gap-4">
              <SearchInput />
            </div>
            <div className="flex-1 flex items-center justify-end gap-4">
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
