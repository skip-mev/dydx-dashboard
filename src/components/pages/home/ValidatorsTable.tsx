import Card, { CardProps } from "@/components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { ArrowRightTopIcon } from "@/components/icons/ArrowRightTop";
import { useValidatorsWithStatsQuery } from "@/hooks";
import { usdIntl } from "@/lib/intl";
import { useHomeStore, useHomeStoreValidatorComparer } from "@/store/home";
import { formatUnits } from "ethers";
import { matchSorter } from "match-sorter";
import Link from "next/link";
import { useMemo } from "react";

export const ValidatorsTable = (props: CardProps) => {
  const blocks = useHomeStore((state) => state.blocks);
  const hideInactive = useHomeStore((state) => state.hideInactive);
  const searchValue = useHomeStore((state) => state.searchValue);

  const validatorComparer = useHomeStoreValidatorComparer();

  const { data: validators } = useValidatorsWithStatsQuery({
    blocks,
    select: (arr = []) => {
      if (hideInactive) {
        arr = arr.filter((validator) => validator.stake !== "0");
      }
      arr = arr.sort(validatorComparer);
      if (searchValue) {
        arr = matchSorter(arr, searchValue, { keys: ["moniker", "pubkey"] });
      }
      return arr;
    },
  });

  const totalStake = useMemo(() => {
    if (!validators) return 0;
    let total = 0;
    for (const { stake } of validators) {
      total += parseFloat(formatUnits(stake, 6));
    }
    return total;
  }, [validators]);

  return (
    <Card className="relative" {...props}>
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
                <TableCell className="w-[208px] flex justify-end">
                  <div className="w-10/12 h-5 bg-white/5"></div>
                </TableCell>
              </TableRow>
            ))}
          {validators &&
            validators.map((validator) => {
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
  );
};
