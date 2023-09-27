import { getValidatorStats, getValidators } from "@/api";
import { Validator, ValidatorWithStats } from "@/types/base";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLatestHeightQuery } from "./height";

export function useValidatorsQuery() {
  const queryKey = useMemo(() => ["USE_VALIDATORS"] as const, []);

  return useQuery({
    queryKey,
    queryFn: async () => {
      return getValidators();
    },
    keepPreviousData: true,
  });
}

export function useValidatorsWithStatsQuery(blocks: number) {
  const { data: toHeight } = useLatestHeightQuery();
  const { data: validators } = useValidatorsQuery();

  const queryKey = useMemo(() => {
    const args = { blocks, toHeight, validators };
    return ["USE_VALIDATORS_WITH_STATS", args] as const;
  }, [blocks, toHeight, validators]);

  return useQuery({
    queryKey,
    queryFn: async ({ queryKey: [, args] }) => {
      if (!args.toHeight) return;
      if (!args.validators) return;

      let fromHeight = args.toHeight - args.blocks;
      if (fromHeight < 0) {
        fromHeight = 1;
      }

      const stats = await getValidatorStats({
        fromHeight,
        toHeight: args.toHeight,
      });

      function withStats(validator: Validator): ValidatorWithStats {
        return {
          ...validator,
          averageMev: parseFloat(stats[validator.pubkey]) || 0.0,
        };
      }

      const validatorWithStats = args.validators
        .map(withStats)
        .sort((a, b) => b.averageMev - a.averageMev);

      return validatorWithStats;
    },
    enabled: !!toHeight && !!validators,
    keepPreviousData: true,
  });
}

// export function useActiveValidatorsWithStatsQuery(blocks: number) {
//   const { data: toHeight } = useLatestHeightQuery();
//   const { data: validators } = useValidatorsQuery();

//   const { data: validatorsWithStats } = useValidatorsWithStatsQuery(blocks);

//   const queryKey = useMemo(() => {
//     const args = { blocks, toHeight, validators };
//     return ["USE_ACTIVE_VALIDATORS_WITH_STATS", args] as const;
//   }, [blocks, toHeight, validators]);

//   return useQuery({
//     queryKey,
//     queryFn: async ({ queryKey: [, args] }) => {
//       if (!validatorsWithStats) return;
//       return validatorsWithStats.filter((validator) => validator.stake !== "0");
//     },
//     enabled: !!toHeight && !!validators && !!validatorsWithStats,
//     keepPreviousData: true,
//   });
// }
