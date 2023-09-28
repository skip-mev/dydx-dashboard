import { useRawMEVQuery, useValidatorsQuery } from "@/hooks";
import Card from "@/components/Card";
import { formatUnits } from "ethers";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowLeftIcon } from "@/components/icons/ArrowLeft";
import { usdIntl } from "@/lib/intl";

function ValidatorPage() {
  const router = useRouter();

  const pubkey = useMemo(() => {
    if (router.query.pubkey) {
      return router.query.pubkey as string;
    }

    return null;
  }, [router.query.pubkey]);

  const { data: validators } = useValidatorsQuery();

  const validator = useMemo(() => {
    if (!validators || !pubkey) {
      return undefined;
    }

    return validators.find((validator) => validator.pubkey === pubkey);
  }, [validators, pubkey]);

  const { data: datapoints } = useRawMEVQuery({
    proposer: validator?.pubkey || "",
    withBlockInfo: true,
  });

  const formattedDatapoints = useMemo(() => {
    if (!datapoints) {
      return [];
    }

    return datapoints.map((datapoint, index) => ({
      ...datapoint,
      key: index + 1,
      value: parseFloat(formatUnits(parseInt(`${datapoint.value}`), 6)),
      probability: datapoint.probability * 100,
    }));
  }, [datapoints]);

  const cumulativeDatapoints = useMemo(() => {
    if (!datapoints) {
      return [];
    }

    const values = Array.from(datapoints).map((datapoint, _) => {
      return parseFloat(formatUnits(parseInt(`${datapoint.value}`), 6));
    });

    return values.map((_, index) => {
      return {
        key: index + 1,
        value: values.slice(0, index + 1).reduce((acc, value) => {
          return acc + value;
        }, 0),
        block: datapoints[index].height,
      };
    });
  }, [datapoints]);

  return (
    <Fragment>
      <Head>
        <title>{validator?.moniker} - dYdX MEV Dashboard | Skip</title>
      </Head>
      <>
        <div className="py-12 space-y-4">
          <Link
            className="text-sm text-white/50 font-bold font-mono flex items-center gap-2"
            href="/"
          >
            <ArrowLeftIcon className="w-[15px] h-[15px]" />
            <span>Return to home</span>
          </Link>
          <h1 className="font-mono font-bold text-3xl">
            {validator && validator.moniker}
          </h1>
        </div>
        {datapoints && (
          <div className="space-y-12 pb-12">
            <div>
              <div className="pb-4">
                <p className="font-mono font-bold text-xl">
                  Orderbook Discrepancy
                </p>
              </div>
              <Card className="p-9 pl-4 py-8">
                <div className="relative">
                  <div className="absolute -rotate-90 translate-y-[140px] -translate-x-[60px] font-mono">
                    Orderbook Discrepancy ($)
                  </div>
                  {formattedDatapoints && (
                    <ResponsiveContainer width="100%" height={296}>
                      <LineChart
                        data={formattedDatapoints}
                        margin={{ top: 5, right: 0, left: 50, bottom: 5 }}
                        syncId="chart"
                      >
                        <XAxis
                          dataKey="key"
                          axisLine={false}
                          tickLine={false}
                          offset={50}
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
                          yAxisId="left"
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
                          yAxisId="right"
                          orientation="right"
                        />
                        <Line
                          dot={false}
                          dataKey="value"
                          stroke="#17b57f"
                          isAnimationActive={false}
                          yAxisId="left"
                          name="Orderbook Discrepancy ($)"
                        />
                        <Legend
                          verticalAlign="top"
                          wrapperStyle={{
                            fill: "#fff",
                            fontFamily: "monospace",
                            fontSize: 13,
                            opacity: 0.8,
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#151617",
                            border: 0,
                          }}
                          labelClassName="font-semibold"
                          wrapperClassName="font-mono text-sm"
                          labelFormatter={(label) => {
                            return `Block: ${
                              formattedDatapoints.find(
                                (datapoint) => datapoint.key === label
                              )?.height
                            }`;
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                  <p className="font-mono text-center pt-4">
                    Past Proposed Blocks
                  </p>
                </div>
              </Card>
            </div>
            <div>
              <div className="pb-4">
                <p className="font-mono font-bold text-xl">
                  Cumulative Orderbook Discrepancy
                </p>
              </div>
              <Card className="p-9 pl-4 py-8">
                <div className="relative">
                  <div className="absolute -rotate-90 translate-y-[140px] -translate-x-[120px] font-mono">
                    Cumulative Orderbook Discrepancy ($)
                  </div>
                  {cumulativeDatapoints && (
                    <ResponsiveContainer width="100%" height={296}>
                      <LineChart
                        data={cumulativeDatapoints}
                        margin={{ top: 5, right: 60, left: 50, bottom: 5 }}
                        syncId="chart"
                      >
                        <XAxis
                          dataKey="key"
                          axisLine={false}
                          tickLine={false}
                          offset={50}
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
                        <Line
                          dot={false}
                          dataKey="value"
                          stroke="#8884d8"
                          isAnimationActive={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#151617",
                            border: 0,
                          }}
                          labelClassName="font-semibold"
                          wrapperClassName="font-mono text-sm"
                          labelFormatter={(label) => {
                            return `Block: ${
                              cumulativeDatapoints.find(
                                (datapoint) => datapoint.key === label
                              )?.block
                            }`;
                          }}
                          formatter={(value) => {
                            return [
                              `${usdIntl.format(+value)}`,
                              "Orderbook Discrepancy",
                            ];
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                  <p className="font-mono text-center pt-4">
                    Past Proposed Blocks
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </>
    </Fragment>
  );
}

export default ValidatorPage;
