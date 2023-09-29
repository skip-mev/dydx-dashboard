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
import clsx from "clsx";
import { formatUnits } from "ethers";
import { matchSorter } from "match-sorter";
import Link from "next/link";
import { useMemo } from "react";

export const ValidatorsTable = () => {
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
    <div className="max-w-full overflow-auto md:[overflow:unset]">
      <Table className="bg-light-3 rounded-none md:rounded-lg w-full">
        <TableHeader
          className={clsx(
            "md:[&>:first-child]:rounded-tl-lg",
            "md:[&>:last-child]:rounded-tr-lg",
            "sticky -top-1 inset-x-0 z-[1]"
          )}
        >
          <TableHead className="text-start max-w-[50vw] w-2/4">
            Validator
          </TableHead>
          <TableHead className="text-end w-1/4">
            Avg. Orderbook Discrepancy
          </TableHead>
          <TableHead className="text-end w-1/4">Stake Weight</TableHead>
        </TableHeader>
        <TableBody>
          {!validators &&
            Array.from({ length: 20 }, (_, i) => (
              <TableRow key={i}>
                <TableCell className="w-2/4">
                  <div className="w-full h-5 bg-white/5" />
                </TableCell>
                <TableCell className="w-1/4">
                  <div className="w-full h-5 bg-white/5" />
                </TableCell>
                <TableCell className="w-1/4">
                  <div className="w-full h-5 bg-white/5" />
                </TableCell>
              </TableRow>
            ))}
          {validators &&
            validators.map((validator, i) => {
              const stake = parseFloat(formatUnits(validator.stake, 6));
              const stakePercent = (stake / totalStake) * 100;
              const averageMev = parseFloat(
                formatUnits(validator.averageMev, 6)
              );
              const isLast = i === validators.length - 1;
              return (
                <TableRow
                  key={validator.pubkey}
                  className={clsx({
                    relative: true,
                    "md:[&>:first-child]:rounded-bl-lg": isLast,
                    "md:[&>:last-child]:rounded-br-lg": isLast,
                  })}
                >
                  <TableCell className="max-w-[50vw] w-2/4">
                    <Link
                      className={clsx(
                        "text-[#6398FF] flex items-center gap-1 hover:underline overflow-hidden",
                        "after:content-[''] after:absolute after:inset-0"
                      )}
                      href={`/validators/${validator.pubkey}`}
                    >
                      <span className="truncate">{validator.moniker}</span>
                      <ArrowRightTopIcon className="w-4 h-4" />
                    </Link>
                  </TableCell>
                  <TableCell align="right" className="w-1/4">
                    {usdIntl.format(averageMev)}
                  </TableCell>
                  <TableCell align="right" className="w-1/4">
                    {stakePercent.toFixed(2)}%
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};
