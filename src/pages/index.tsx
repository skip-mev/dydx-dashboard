/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import {
  useCumulativeNormalizedMEVQuery,
  useValidatorsWithStatsQuery,
} from "@/api";
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
import { useQueries } from "@tanstack/react-query";
import {
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function leftPadArray(array: number[], length: number) {
  if (array.length >= length) {
    return array;
  }

  const n = length - array.length;

  const a = Array.from({ length: n }).fill(0) as number[];

  return a.concat(array);
}

export default function Home() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [blocks, setBlocks] = useState(43200);

  const [selectedValidator, setSelectedValidator] = useState<
    | {
        averageMev: string;
        averageNormalizedMev: number;
        moniker: string;
        pubkey: string;
        stake: string;
      }
    | undefined
  >(undefined);

  const [highlightedValidator, setHighlightedValidator] = useState<
    | {
        averageMev: string;
        averageNormalizedMev: number;
        moniker: string;
        pubkey: string;
        stake: string;
      }
    | undefined
  >(undefined);

  const { data: validators, fetchStatus } = useValidatorsWithStatsQuery(blocks);

  useEffect(() => {
    if (validators) {
      setSelectedValidator(validators[0]);
    }
  }, [validators]);

  const { data: cumulativeMEV } = useCumulativeNormalizedMEVQuery(blocks);

  const chartData = useMemo(() => {
    if (!cumulativeMEV) {
      return [];
    }

    const points = [];

    const validatorData = cumulativeMEV.reduce((acc, data) => {
      return {
        ...acc,
        [data.validator]: leftPadArray(
          data.cumulativeNormalizedMEV.map((v) => v.value),
          1000
        ),
      };
    }, {} as Record<string, number[]>);

    for (let i = 0; i < 1000; i++) {
      const point = {
        key: 1000 - i,
      };

      for (const { validator } of cumulativeMEV) {
        // @ts-ignore
        point[validator] = validatorData[validator][i];
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
        const aStake = parseFloat(ethers.formatUnits(a.stake, 6));
        const bStake = parseFloat(ethers.formatUnits(b.stake, 6));

        return bStake - aStake;
      })
      .filter((validator) => {
        return validator.moniker
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
  }, [searchValue, validators]);

  return (
    <Layout>
      {fetchStatus === "fetching" && (
        <div className="w-full h-1 bg-indigo-500 absolute top-0 left-0 right-0 overflow-hidden">
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
            <p className="font-mono font-bold text-xl">
              Order Book Discrepancy
            </p>
          </div>
          <div>
            {validators && selectedValidator && (
              <div className="w-[300px] z-40">
                <p className="text-sm font-medium text-light/50 mb-3">
                  Highlight Validator:
                </p>
                <Select
                  value={selectedValidator.moniker}
                  onValueChange={(value) => {
                    const validator = validators.find(
                      (v) => v.moniker === value
                    );

                    setSelectedValidator(validator);
                  }}
                  onOpenChange={() => setHighlightedValidator(undefined)}
                >
                  <SelectTrigger className="border border-light/25 py-2 w-full" />
                  <SelectContent>
                    {validators.map((validator) => (
                      <SelectItem
                        key={validator.moniker}
                        value={validator.moniker}
                        onMouseOver={() => setHighlightedValidator(validator)}
                      >
                        {validator.moniker}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
                  <div className="absolute -rotate-90 translate-y-[130px] -translate-x-[105px] font-mono text-xs">
                    Cumulative Order Book Discrepancy (bps)
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
                      {validators &&
                        validators.map((validator) => {
                          return (
                            <Line
                              key={validator.pubkey}
                              dot={false}
                              dataKey={validator.moniker}
                              stroke={
                                validator.moniker ===
                                  selectedValidator?.moniker ||
                                validator.moniker ===
                                  highlightedValidator?.moniker
                                  ? "#34F3FF"
                                  : "#8884d8"
                              }
                              isAnimationActive={false}
                              opacity={
                                validator.moniker ===
                                  selectedValidator?.moniker ||
                                validator.moniker ===
                                  highlightedValidator?.moniker
                                  ? 1
                                  : 0.3
                              }
                              onClick={() => setSelectedValidator(validator)}
                            ></Line>
                          );
                        })}
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="font-mono text-center text-sm pt-4">
                    Past Proposed Blocks
                  </p>
                </Fragment>
              )}
            </div>
          </Card>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="space-y-5">
            <p className="font-mono font-bold text-xl">Validators</p>
          </div>
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
            <div className="w-[100px] flex justify-end">
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
          </div>
        </div>
        <div>
          <div>
            <Card className="relative">
              <Table>
                <TableHeader>
                  <TableHead>Validator</TableHead>
                  <TableHead align="right">
                    Avg. Orderbook <br /> Discrepancy
                  </TableHead>
                  <TableHead align="right">
                    Normalized Orderbook <br /> Discrepancy (bps)
                  </TableHead>
                  <TableHead align="right">Stake Weight %</TableHead>
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
                        <TableCell className="w-[208px]">
                          <div className="w-full h-5 bg-white/5"></div>
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

                      const averageNormalizedMev =
                        validator.averageNormalizedMev * 10000;
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
                            {averageNormalizedMev.toFixed(3)}
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
        {/* HERE */}
      </div>
    </Layout>
  );
}
