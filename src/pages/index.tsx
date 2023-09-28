/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useMemo } from "react";
import Link from "next/link";
import { formatUnits } from "ethers";
import { useMainChartData, useValidatorsWithStatsQuery } from "@/hooks";
import Card from "@/components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/Select";
import { Input } from "@/components/Input";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
} from "recharts";
import Head from "next/head";
import CustomTooltip from "@/components/CustomTooltip";
import * as Checkbox from "@radix-ui/react-checkbox";
import { ArrowRightTopIcon } from "@/components/icons/ArrowRightTop";
import { CheckIcon } from "@/components/icons/Check";
import { SearchIcon } from "@/components/icons/Search";
import { SortIcon } from "@/components/icons/Sort";
import { usdIntl } from "@/lib/intl";
import {
  addSelectedValidator,
  removeSelectedValidator,
  resetSelectedValidators,
  useHomeStore,
} from "@/store/home";
import { SearchInput } from "@/components/pages/home/SearchInput";
import { InactiveToggle } from "@/components/pages/home/InactiveToggle";
import { TimeframeSelect } from "@/components/pages/home/TimeframeSelect";

export default function Home() {
  const {
    searchValue,
    blocks,
    sortBy,
    sortDirection,
    selectedValidators,
    highlightedValidator,
    hideInactive,
  } = useHomeStore();

  const { data: validators, fetchStatus } = useValidatorsWithStatsQuery(blocks);

  const activeValidators = useMemo(() => {
    return validators?.filter((validator) => validator.stake !== "0");
  }, [validators]);

  const filteredValidators = useMemo(() => {
    return hideInactive ? activeValidators : validators;
  }, [activeValidators, hideInactive, validators]);

  useEffect(() => {
    if (filteredValidators && selectedValidators.length === 0) {
      resetSelectedValidators([filteredValidators[0]]);
    }
  }, [selectedValidators, filteredValidators]);

  const { data: mainChartData } = useMainChartData();

  const chartData = useMemo(() => {
    return mainChartData?.points ?? [];
  }, [mainChartData?.points]);

  const totalStake = useMemo(() => {
    if (!filteredValidators) {
      return 0;
    }

    return filteredValidators.reduce((acc, validator) => {
      return acc + parseFloat(formatUnits(validator.stake, 6));
    }, 0);
  }, [filteredValidators]);

  const sortedValidators = useMemo(() => {
    if (!filteredValidators) {
      return undefined;
    }

    return filteredValidators
      .sort((a, b) => {
        if (sortBy === "validator" && sortDirection === "asc") {
          return a.moniker.localeCompare(b.moniker);
        }

        if (sortBy === "validator" && sortDirection === "desc") {
          return b.moniker.localeCompare(a.moniker);
        }

        if (sortBy === "averageMev") {
          const aMev = parseFloat(formatUnits(a.averageMev, 6));
          const bMev = parseFloat(formatUnits(b.averageMev, 6));

          return sortDirection === "asc" ? aMev - bMev : bMev - aMev;
        }

        if (sortBy === "stake") {
          const aStake = parseFloat(formatUnits(a.stake, 6));
          const bStake = parseFloat(formatUnits(b.stake, 6));

          return sortDirection === "asc" ? aStake - bStake : bStake - aStake;
        }

        return -1;
      })
      .filter((validator) => {
        return validator.moniker
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
  }, [filteredValidators, searchValue, sortBy, sortDirection]);

  return (
    <>
      <Head>
        <title>dYdX MEV Dashboard | Skip</title>
      </Head>
      {fetchStatus === "fetching" && (
        <div className="w-full h-1 bg-indigo-500 fixed top-0 left-0 right-0 overflow-hidden">
          <div className="bg-indigo-600 w-full h-full animate-fade-right animate-infinite"></div>
        </div>
      )}
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
            className={`p-6 pr-4 ${
              chartData.length === 0 ? "animate-pulse" : null
            }`}
          >
            <div className="relative">
              {chartData.length === 0 && <div className="h-[300px] w-full" />}
              {chartData.length > 0 && (
                <Fragment>
                  <div className="absolute -rotate-90 translate-y-[130px] -translate-x-[110px] font-mono text-xs">
                    Cumulative Orderbook Discrepancy ($)
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="key"
                        axisLine={false}
                        tickLine={false}
                        style={{
                          fill: "#fff",
                          fontFamily: "monospace",
                          fontSize: 13,
                          opacity: 0.8,
                        }}
                        minTickGap={50}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        padding={{ top: 20, bottom: 20 }}
                        style={{
                          fill: "#fff",
                          fontFamily: "monospace",
                          fontSize: 13,
                          opacity: 0.8,
                        }}
                      />
                      <ChartTooltip content={CustomTooltip} />
                      {filteredValidators &&
                        filteredValidators.map((validator) => {
                          return (
                            <Line
                              key={validator.pubkey}
                              dot={false}
                              dataKey={validator.moniker}
                              stroke={
                                selectedValidators.includes(validator)
                                  ? "#b51717"
                                  : validator.moniker ===
                                    highlightedValidator?.moniker
                                  ? "#34F3FF"
                                  : "#8884d8"
                              }
                              isAnimationActive={false}
                              opacity={
                                selectedValidators.includes(validator) ||
                                validator.moniker ===
                                  highlightedValidator?.moniker
                                  ? 1
                                  : 0.3
                              }
                              onClick={() => {
                                if (selectedValidators.includes(validator)) {
                                  removeSelectedValidator(validator);
                                } else {
                                  addSelectedValidator(validator);
                                }
                              }}
                            ></Line>
                          );
                        })}
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="font-mono text-center text-sm pt-4">
                    Past Proposed Blocks
                  </p>
                  <div className="flex justify-center gap-2 flex-wrap pt-8">
                    {filteredValidators?.map((validator) => (
                      <button
                        className={`${
                          selectedValidators.includes(validator)
                            ? "bg-[#b51717]"
                            : "bg-white/5 hover:bg-[#b51717]"
                        } text-xs py-1 px-2 rounded-md transition-colors`}
                        key={validator.pubkey}
                        onMouseOver={() =>
                          useHomeStore.setState({
                            highlightedValidator: validator,
                          })
                        }
                        onClick={() => {
                          if (selectedValidators.includes(validator)) {
                            removeSelectedValidator(validator);
                          } else {
                            addSelectedValidator(validator);
                          }
                        }}
                      >
                        {validator.moniker}
                      </button>
                    ))}
                  </div>
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
                <Select
                  defaultValue="stake"
                  onValueChange={(value) => {
                    useHomeStore.setState({ sortBy: value });
                  }}
                >
                  <SelectTrigger />
                  <SelectContent>
                    <SelectItem value="validator">Validator</SelectItem>
                    <SelectItem value="averageMev">Avg. Discrepancy</SelectItem>
                    <SelectItem value="stake">Stake Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm text-white/50">Direction:</p>
                <button
                  className="text-white/70 hover:text-white transition-colors"
                  onClick={() => {
                    useHomeStore.setState({
                      sortDirection: sortDirection === "asc" ? "desc" : "asc",
                    });
                  }}
                >
                  <SortIcon className="w-4 h-4" direction={sortDirection} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <Card className="relative">
              <Table>
                <TableHeader>
                  <TableHead>Validator</TableHead>
                  <TableHead align="right">
                    <span>
                      Avg. Orderbook <br /> Discrepancy
                    </span>
                  </TableHead>
                  <TableHead align="right">Stake Weight</TableHead>
                </TableHeader>
                <TableBody>
                  {!sortedValidators &&
                    Array.from({ length: 20 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell className="w-[400px]">
                          <div className="w-full h-5 bg-white/5"></div>
                        </TableCell>
                        <TableCell className="w-[208px]">
                          <div className="w-full h-5 bg-white/5"></div>
                        </TableCell>
                        <TableCell className="w-[208px]">
                          <div className="w-full h-5 bg-white/5"></div>
                        </TableCell>
                        <TableCell className="w-[208px] flex justify-end">
                          <div className="w-10/12 h-5 bg-white/5"></div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {sortedValidators &&
                    sortedValidators.map((validator) => {
                      const stake = parseFloat(formatUnits(validator.stake, 6));
                      const stakePercent = (stake / totalStake) * 100;

                      const averageMev = parseFloat(
                        formatUnits(validator.averageMev, 6)
                      );

                      return (
                        <TableRow key={validator.pubkey}>
                          <TableCell className="w-[400px] truncate">
                            <Link
                              className="text-[#6398FF] inline-flex items-center gap-1 hover:underline"
                              href={`/validators/${validator.pubkey}`}
                            >
                              <span>{validator.moniker}</span>
                              <ArrowRightTopIcon className="w-4 h-4" />
                            </Link>
                          </TableCell>
                          <TableCell align="right" className="w-[208px]">
                            {usdIntl.format(averageMev)}
                          </TableCell>
                          <TableCell align="right" className="w-[208px]">
                            {stakePercent.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
