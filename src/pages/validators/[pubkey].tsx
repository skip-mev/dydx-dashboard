import Card from "@/components/Card";
import { ArrowLeftIcon } from "@/components/icons/ArrowLeft";
import {
  useRawMEVQuery,
  useValidatorPageQuery,
  useValidatorsQuery,
} from "@/hooks";
import { usdIntl } from "@/lib/intl";
import clsx from "clsx";
import { formatUnits } from "ethers";
import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ValidatorPage() {
  const { pubkey } = useValidatorPageQuery();

  const { data: validator } = useValidatorsQuery({
    select: (arr = []) => arr.find((v) => v.pubkey === pubkey),
  });

  const { data: datapoints = [] } = useRawMEVQuery({
    proposer: validator?.pubkey,
    withBlockInfo: true,
    select: (arr = []) => {
      return arr.map((datapoint, index) => ({
        ...datapoint,
        key: index + 1,
        value: parseFloat(formatUnits(parseInt(`${datapoint.value}`), 6)),
        probability: datapoint.probability * 100,
      }));
    },
  });

  const datapointHeights = useMemo(() => {
    return Object.fromEntries(
      datapoints.map(({ key, height }) => [key, height])
    );
  }, [datapoints]);

  const cumulativeDatapoints = useMemo(() => {
    return datapoints.map((_, idx, arr) => ({
      key: idx + 1,
      value: arr.slice(0, idx + 1).reduce((acc, { value }) => acc + value, 0),
      block: arr[idx].height,
    }));
  }, [datapoints]);

  const cumulativeDatapointHeights = useMemo(() => {
    return Object.fromEntries(
      cumulativeDatapoints.map(({ key, block }) => [key, block])
    );
  }, [cumulativeDatapoints]);

  return (
    <>
      <Head>
        <title>{validator?.moniker} - dYdX MEV Dashboard | Skip</title>
      </Head>
      <div className="py-12 space-y-4 flex flex-col items-center md:items-start">
        <Link
          className="text-sm text-white/50 font-bold font-mono flex items-center gap-2"
          href="/"
        >
          <ArrowLeftIcon className="w-[15px] h-[15px]" />
          <span>Return to home</span>
        </Link>
        <h1 className="font-mono font-bold text-3xl">{validator?.moniker}</h1>
      </div>
      <div className="space-y-12 pb-12">
        <div>
          <p className="font-mono font-bold text-xl pb-4 text-center md:text-start px-2">
            Orderbook Discrepancy
          </p>
          <Card
            className={clsx({
              "relative py-6 md:pl-6 rounded-none md:rounded-lg overflow-hidden":
                true,
              "animate-pulse": datapoints.length < 1,
            })}
          >
            <div
              className={clsx(
                "[writing-mode:vertical-lr] rotate-180 font-mono text-xs text-center",
                "h-[300px] absolute left-3 top-3 md:left-6 md:top-6"
              )}
            >
              Orderbook Discrepancy ($)
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={datapoints}
                margin={{ right: -24 }}
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151617",
                    border: 0,
                  }}
                  labelClassName="font-semibold"
                  wrapperClassName="font-mono text-sm"
                  labelFormatter={(label) => {
                    return `Block: ${datapointHeights[label]}`;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="font-mono text-center pt-4">Past Proposed Blocks</p>
          </Card>
        </div>
        <div>
          <p className="font-mono font-bold text-xl pb-4 text-center md:text-start px-2">
            Cumulative Orderbook Discrepancy
          </p>
          <Card
            className={clsx({
              "relative py-6 md:pl-6 rounded-none md:rounded-lg overflow-hidden":
                true,
              "animate-pulse": datapoints.length < 1,
            })}
          >
            <div
              className={clsx(
                "[writing-mode:vertical-lr] rotate-180 font-mono text-xs text-center",
                "h-[300px] absolute left-2 top-2 md:left-4 md:top-4"
              )}
            >
              Cumulative Orderbook Discrepancy ($)
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={cumulativeDatapoints}
                margin={{ right: 32 }}
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
                    return `Block: ${cumulativeDatapointHeights[label]}`;
                  }}
                  formatter={(value) => [
                    `${usdIntl.format(+value)}`,
                    "Orderbook Discrepancy",
                  ]}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="font-mono text-center pt-4">Past Proposed Blocks</p>
          </Card>
        </div>
      </div>
    </>
  );
}

export default ValidatorPage;
