/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import { useValidatorsWithStatsQuery } from "@/api";
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
import * as Tooltip from "@radix-ui/react-tooltip";

export default function Home() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [blocks, setBlocks] = useState(43200);

  const { data: validators, fetchStatus } = useValidatorsWithStatsQuery(blocks);

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-12">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <img className="h-8" src="/dydx-logo.svg" alt="" />
            <span className="text-4xl leading-[32px] font-black">/</span>
            <img className="h-8" src="/skip-logo.svg" alt="" />
          </div>
          <p className="font-mono font-bold text-xl">Order Book Discrepancy</p>
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
      <div className="pb-12">
        <Card className="relative">
          <Table>
            <TableHeader>
              <TableHead>Validator</TableHead>
              <TableHead align="right">
                Avg. Orderbook <br /> Discrepancy
              </TableHead>
              <TableHead align="right">
                <div className="flex items-center justify-end gap-2 -mr-7">
                  <span>
                    Normalized Orderbook <br /> Discrepancy (bps)
                  </span>
                  <Tooltip.Provider>
                    <Tooltip.Root delayDuration={0}>
                      <Tooltip.Trigger asChild>
                        <button className="block text-white/25 -mt-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="bg-[#151617] text-light/75 text-xs border border-zinc-800 rounded-md shadow-md font-sans w-[200px] p-4"
                          sideOffset={5}
                        >
                          Abnormally high values might occur because of the
                          difference in between observed and calculated volumes
                          <Tooltip.Arrow className="TooltipArrow" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
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
    </Layout>
  );
}
