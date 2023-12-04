import Card from "@/components/Card";
import { DydxIcon } from "@/components/icons/Dydx";
import { SkipIcon } from "@/components/icons/Skip";
import { InactiveToggle } from "@/components/pages/home/InactiveToggle";
import { MainChart } from "@/components/pages/home/MainChart";
import { MainChartToggles } from "@/components/pages/home/MainChartToggles";
import { SearchInput } from "@/components/pages/home/SearchInput";
import { SortBySelect } from "@/components/pages/home/SortBySelect";
import { SortOrderButton } from "@/components/pages/home/SortOrderButton";
import { TimeframeSelect } from "@/components/pages/home/TimeframeSelect";
import { ValidatorLoadingIndicator } from "@/components/pages/home/ValidatorLoadingIndicator";
import { ValidatorsTable } from "@/components/pages/home/ValidatorsTable/legacy";
import clsx from "clsx";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>dYdX MEV Dashboard | Skip</title>
      </Head>
      <ValidatorLoadingIndicator />
      <div className="py-12 space-y-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="space-y-5">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <DydxIcon className="h-8" />
              <span className="text-4xl leading-[32px] font-black">/</span>
              <SkipIcon className="h-8" />
            </div>
            <p className="font-mono font-bold text-xl text-center md:text-start">
              Orderbook Discrepancy
            </p>
          </div>
        </div>
        <Card className="relative p-3 md:p-6 rounded-none md:rounded-lg">
          <div
            className={clsx(
              "[writing-mode:vertical-lr] rotate-180 font-mono text-xs text-center",
              "h-[300px] absolute left-3 top-3 md:left-6 md:top-6"
            )}
          >
            Cumulative Orderbook Discrepancy ($)
          </div>
          <MainChart />
          <p className="font-mono text-center text-sm pt-4">
            Past Proposed Blocks
          </p>
          <MainChartToggles />
        </Card>
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
