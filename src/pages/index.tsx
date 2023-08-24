/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import { useCumulativeMEVQuery, useValidatorsWithStatsQuery } from "@/api";
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
import Layout from "@/components/Layout";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
} from "recharts";
import Head from "next/head";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#151617] p-4 font-mono text-xs border border-zinc-800 rounded-md shadow-md">
        {payload
          .sort((a: any, b: any) => b.value - a.value)
          .slice(0, 10)
          .map((item: any, index: number) => {
            return (
              <div
                className={`flex items-center gap-4 ${
                  item.stroke === "#17b57f" ? "text-[#17b57f]" : null
                }`}
                key={index}
              >
                <p className="flex-1 max-w-[100px] truncate">
                  {item.dataKey}:{" "}
                </p>
                <p>
                  {new Intl.NumberFormat("en-US", {
                    currency: "USD",
                    style: "currency",
                  }).format(item.value as number)}{" "}
                </p>
              </div>
            );
          })}
      </div>
    );
  }

  return null;
};

export default function Home() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [blocks, setBlocks] = useState(43200);

  const [sortBy, setSortBy] = useState("stake");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [selectedValidators, setSelectedValidators] = useState<
    | {
        averageMev: string;
        moniker: string;
        pubkey: string;
        stake: string;
      }[]
  >([]);

  const [highlightedValidator, setHighlightedValidator] = useState<
    | {
        averageMev: string;
        moniker: string;
        pubkey: string;
        stake: string;
      }
    | undefined
  >(undefined);

  const { data: validators, fetchStatus } = useValidatorsWithStatsQuery(blocks);

  useEffect(() => {
    if (validators && selectedValidators.length === 0) {
      setSelectedValidators([
        ...selectedValidators,
        [...validators].sort(
          (a, b) => parseInt(b.averageMev) - parseInt(a.averageMev)
        )[0],
      ]);
    }
  }, [selectedValidators, validators]);

  const { data: cumulativeMEV } = useCumulativeMEVQuery();

  const chartData = useMemo(() => {
    if (!cumulativeMEV) {
      return [];
    }

    const points = [];

    const validatorData = cumulativeMEV.reduce((acc, data) => {
      return {
        ...acc,
        [data.validator]: data.cumulativeMEV.map((v) =>
          parseFloat(ethers.formatUnits(v.value.toFixed(0), 6))
        ),
      };
    }, {} as Record<string, number[]>);

    for (let i = 0; i < 1000; i++) {
      const point = {
        key: i + 1,
      };

      for (const { validator } of cumulativeMEV) {
        if (i in validatorData[validator]) {
          // @ts-ignore
          point[validator] = validatorData[validator][i];
        }
      }

      points.push(point);
    }

    return points;
  }, [cumulativeMEV]);

  const totalStake = useMemo(() => {
    if (!validators) {
      return 0;
    }

    return validators.reduce((acc, validator) => {
      return acc + parseFloat(ethers.formatUnits(validator.stake, 6));
    }, 0);
  }, [validators]);

  const sortedValidators = useMemo(() => {
    if (!validators) {
      return undefined;
    }

    return [...validators]
      .sort((a, b) => {
        if (sortBy === "validator" && sortDirection === "asc") {
          return a.moniker.localeCompare(b.moniker);
        }

        if (sortBy === "validator" && sortDirection === "desc") {
          return b.moniker.localeCompare(a.moniker);
        }

        if (sortBy === "averageMev") {
          const aMev = parseFloat(ethers.formatUnits(a.averageMev, 6));
          const bMev = parseFloat(ethers.formatUnits(b.averageMev, 6));

          return sortDirection === "asc" ? aMev - bMev : bMev - aMev;
        }

        if (sortBy === "stake") {
          const aStake = parseFloat(ethers.formatUnits(a.stake, 6));
          const bStake = parseFloat(ethers.formatUnits(b.stake, 6));

          return sortDirection === "asc" ? aStake - bStake : bStake - aStake;
        }

        return -1;
      })
      .filter((validator) => {
        return validator.moniker
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
  }, [searchValue, sortBy, sortDirection, validators]);

  return (
    <Layout>
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
                      <ChartTooltip content={<CustomTooltip />} />
                      {validators &&
                        validators
                          .sort(
                            (a, b) =>
                              parseFloat(b.averageMev) -
                              parseFloat(a.averageMev)
                          )
                          .map((validator) => {
                            return (
                              <Line
                                key={validator.pubkey}
                                dot={false}
                                dataKey={validator.moniker}
                                stroke={
                                  selectedValidators.includes(validator)
                                    ? "#17b57f"
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
                                    setSelectedValidators(
                                      selectedValidators.filter(
                                        (v) => v.pubkey !== validator.pubkey
                                      )
                                    );
                                  } else {
                                    setSelectedValidators([
                                      ...selectedValidators,
                                      validator,
                                    ]);
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
                    {validators?.map((validator) => (
                      <button
                        className={`${
                          selectedValidators.includes(validator)
                            ? "bg-[#17b57f]"
                            : "bg-white/5 hover:bg-[#17b57f]"
                        } text-xs py-1 px-2 rounded-md transition-colors`}
                        key={validator.pubkey}
                        onMouseOver={() => setHighlightedValidator(validator)}
                        onClick={() => {
                          if (selectedValidators.includes(validator)) {
                            setSelectedValidators(
                              selectedValidators.filter(
                                (v) => v.pubkey !== validator.pubkey
                              )
                            );
                          } else {
                            setSelectedValidators([
                              ...selectedValidators,
                              validator,
                            ]);
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
              <Input
                leadingIcon={() => (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                placeholder="Filter validators"
                value={searchValue}
                onChange={(value) => setSearchValue(value)}
              />
            </div>
            <div className="flex-1 flex items-center justify-end gap-4">
              <div className="flex items-center gap-1">
                <p className="text-sm text-white/50">Timeframe:</p>
                <Select
                  defaultValue="today"
                  onValueChange={(value) => {
                    const strToBlocks: Record<string, number> = {
                      today: 43200,
                      "7D": 302400,
                      "30D": 2116800,
                    };

                    setBlocks(strToBlocks[value]);
                  }}
                >
                  <SelectTrigger />
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7D">7 Days</SelectItem>
                    <SelectItem value="30D">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-sm text-white/50">Sort By:</p>
                <Select
                  defaultValue="stake"
                  onValueChange={(value) => {
                    setSortBy(value);
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
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  }}
                >
                  {sortDirection === "desc" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 3.75A.75.75 0 012.75 3h11.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zM2 7.5a.75.75 0 01.75-.75h7.508a.75.75 0 010 1.5H2.75A.75.75 0 012 7.5zM14 7a.75.75 0 01.75.75v6.59l1.95-2.1a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 111.1-1.02l1.95 2.1V7.75A.75.75 0 0114 7zM2 11.25a.75.75 0 01.75-.75h4.562a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {sortDirection === "asc" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 3.75A.75.75 0 012.75 3h11.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zM2 7.5a.75.75 0 01.75-.75h6.365a.75.75 0 010 1.5H2.75A.75.75 0 012 7.5zM14 7a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02l-1.95-2.1v6.59a.75.75 0 01-1.5 0V9.66l-1.95 2.1a.75.75 0 11-1.1-1.02l3.25-3.5A.75.75 0 0114 7zM2 11.25a.75.75 0 01.75-.75H7A.75.75 0 017 12H2.75a.75.75 0 01-.75-.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
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
                      const stake = parseFloat(
                        ethers.formatUnits(validator.stake, 6)
                      );
                      const stakePercent = (stake / totalStake) * 100;

                      const averageMev = parseFloat(
                        ethers.formatUnits(validator.averageMev, 6)
                      );

                      return (
                        <TableRow key={validator.pubkey}>
                          <TableCell className="w-[400px] truncate">
                            <Link
                              className="text-[#6398FF] inline-flex items-center gap-1 hover:underline"
                              href={`/validators/${validator.pubkey}`}
                            >
                              <span>{validator.moniker}</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Link>
                          </TableCell>
                          <TableCell align="right" className="w-[208px]">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(averageMev)}
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
    </Layout>
  );
}
