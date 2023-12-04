import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { ArrowRightTopIcon } from "@/components/icons/ArrowRightTop";
import { SortIcon } from "@/components/icons/Sort";
import { useValidatorsWithStatsQuery } from "@/hooks";
import { usdIntl } from "@/lib/intl";
import {
  HomeStore,
  useHomeStore,
  useHomeStoreValidatorComparer,
} from "@/store/home";
import clsx from "clsx";
import { formatUnits } from "ethers";
import { matchSorter } from "match-sorter";
import Link from "next/link";
import { useMemo } from "react";

export const ValidatorsTable = () => {
  const blocks = useHomeStore((state) => state.blocks);
  const hideInactive = useHomeStore((state) => state.hideInactive);
  const searchValue = useHomeStore((state) => state.searchValue);
  const sortBy = useHomeStore((state) => state.sortBy);
  const sortDirection = useHomeStore((state) => state.sortDirection);

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

  function handleSort(sortBy: HomeStore["sortBy"]) {
    useHomeStore.setState((prev) => ({
      sortBy,
      sortDirection:
        prev.sortBy === sortBy
          ? prev.sortDirection === "asc"
            ? "desc"
            : "asc"
          : sortBy === "validator"
          ? "asc"
          : "desc",
    }));
  }

  return (
    <div className="max-w-full overflow-auto md:[overflow:unset] min-h-[75vh]">
      <Table className="bg-light-30 rounded-none md:rounded-lg w-full">
        <TableHeader
          className={clsx(
            "md:[&>:first-child]:rounded-tl-lg",
            "md:[&>:last-child]:rounded-tr-lg",
            "sticky -top-1 inset-x-0 z-[1]"
          )}
        >
          <TableHead className="text-start max-w-[50vw] w-2/4 hover:bg-white/5">
            <button
              className="flex items-center gap-2 w-full before:absolute before:inset-0 before:content-['']"
              onClick={() => handleSort("validator")}
            >
              <span>Validator</span>
              <div>
                {sortBy === "validator" && (
                  <SortIcon className="w-4 h-4" direction={sortDirection} />
                )}
              </div>
            </button>
          </TableHead>
          <TableHead
            className="text-end w-1/4 hover:bg-white/5"
            onClick={() => handleSort("averageMev")}
          >
            <button className="flex items-center justify-end gap-2 w-full before:absolute before:inset-0 before:content-['']">
              <div>
                {sortBy === "averageMev" && (
                  <SortIcon className="w-4 h-4" direction={sortDirection} />
                )}
              </div>
              <span>Avg. Orderbook Discrepancy</span>
            </button>
          </TableHead>
          <TableHead className="text-end w-1/4 hover:bg-white/5">
            <button
              className="flex items-center justify-end gap-2 w-full before:absolute before:inset-0 before:content-['']"
              onClick={() => handleSort("stake")}
            >
              <div>
                {sortBy === "stake" && (
                  <SortIcon className="w-4 h-4" direction={sortDirection} />
                )}
              </div>
              <span>Stake Weight</span>
            </button>
          </TableHead>
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
                    "md:[&>:first-child]:rounded-bl-lg": isLast,
                    "md:[&>:last-child]:rounded-br-lg": isLast,
                  })}
                >
                  <TableCell className="max-w-[50vw] w-2/4">
                    <Link
                      className={clsx(
                        "text-blue-400 flex items-center gap-1 hover:underline relative",
                        "after:content-[''] after:absolute after:-inset-4"
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
