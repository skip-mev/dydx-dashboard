import { getValidatorStats, getValidators } from "@/api";
import { stringOrUndefined } from "@/lib/string";
import { Validator, ValidatorWithStats } from "@/types/base";
import { slugifyWithCounter } from "@sindresorhus/slugify";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useLatestHeightQuery } from "./height";

export function useValidatorPageQuery() {
  const router = useRouter();
  return {
    pubkey: stringOrUndefined(router.query.pubkey),
  };
}

export type UseValidatorsQueryArgs<T = Validator[]> = {
  select?: (arr?: Validator[]) => T;
};

export function useValidatorsQuery<T = Validator[]>(
  args: UseValidatorsQueryArgs<T> = {}
) {
  const { select = (t) => t as T } = args;

  const queryKey = useMemo(() => ["USE_VALIDATORS"] as const, []);

  return useQuery({
    queryKey,
    queryFn: async () => {
      return getValidators();
    },
    select,
  });
}

export type UseValidatorsWithStatsArgs<T = ValidatorWithStats[]> = {
  blocks: number;
  select?: (arr?: ValidatorWithStats[]) => T;
};

export function useValidatorsWithStatsQuery<T = ValidatorWithStats[]>(
  args: UseValidatorsWithStatsArgs<T>
) {
  const { blocks, select = (t) => t as T } = args;

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

      const slugify = slugifyWithCounter();

      function withStats(validator: Validator): ValidatorWithStats {
        return {
          ...validator,
          slug: slugify(validator.moniker),
          averageMev: parseFloat(stats[validator.pubkey]) || 0.0,
        };
      }

      const validatorWithStats = args.validators.map(withStats);

      return validatorWithStats;
    },
    enabled: !!toHeight && !!validators,
    select,
  });
}
