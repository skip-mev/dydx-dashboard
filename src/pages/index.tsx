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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
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
                Normalized Orderbook <br /> Discrepancy (bps)
              </TableHead>
              <TableHead align="right">Stake Weight %</TableHead>
            </TableHeader>
            <TableBody>
              {!validators &&
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
              {validators &&
                validators.map((validator) => {
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
