import {
  useNormalizedMEVQuery,
  useRawMEVQuery,
  useValidatorsQuery,
} from "@/api";
import Card from "@/components/Card";
import Layout from "@/components/Layout";
import { ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

  const { data: validatorMEV } = useNormalizedMEVQuery(
    validator?.pubkey || "",
    43200
  );

  const datapoints = useMemo(() => {
    if (!validatorMEV) {
      return [];
    }

    return [...validatorMEV]
      .map((datapoint, index) => {
        return {
          key: index + 1,
          block: datapoint.height,
          value: datapoint.value * 10000,
        };
      })
      .reverse();
  }, [validatorMEV]);

  const { data: rawMEV } = useRawMEVQuery(validator?.pubkey || "", 43200);

  const rawMEVDatapoints = useMemo(() => {
    if (!rawMEV) {
      return [];
    }

    const values = [...rawMEV].reverse().map((datapoint, index) => {
      return parseFloat(ethers.formatUnits(parseInt(`${datapoint.value}`), 6));
    });

    return values.map((_, index) => {
      return {
        key: values.length - index,
        value: values.slice(0, index + 1).reduce((acc, value) => {
          return acc + value;
        }, 0),
      };
    });
  }, [rawMEV]);

  return (
    <Layout>
      <div className="py-12 space-y-4">
        <Link
          className="text-sm text-white/50 font-bold font-mono flex items-center gap-2"
          href="/"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.875 7.5H3.125"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.5 11.875L3.125 7.5L7.5 3.125"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>Return to home</span>
        </Link>
        <h1 className="font-mono font-bold text-3xl">
          {validator && validator.moniker}
        </h1>
      </div>
      {validatorMEV && rawMEV && (
        <div className="space-y-12 pb-12">
          <div>
            <div className="pb-4">
              <p className="font-mono font-bold text-xl">
                Normalized Orderbook Discrepancy
              </p>
            </div>
            <Card className="p-9 pl-4 py-8">
              <div className="relative">
                <div className="absolute -rotate-90 translate-y-[130px] -translate-x-[80px] font-mono">
                  Orderbook Discrepancy (bps)
                </div>
                {validatorMEV && (
                  <ResponsiveContainer width="100%" height={296}>
                    <LineChart
                      data={datapoints}
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
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
                            datapoints.find(
                              (datapoint) => datapoint.key === label
                            )?.block
                          }`;
                        }}
                        formatter={(value) => {
                          return [
                            `${new Intl.NumberFormat("en-US", {}).format(
                              value as number
                            )} bps`,
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
                {validatorMEV && (
                  <ResponsiveContainer width="100%" height={296}>
                    <LineChart
                      data={rawMEVDatapoints}
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
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
                            datapoints.find(
                              (datapoint) => datapoint.key === label
                            )?.block
                          }`;
                        }}
                        formatter={(value) => {
                          return [
                            `$${new Intl.NumberFormat("en-US", {
                              currency: "USD",
                            }).format(value as number)}`,
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
    </Layout>
  );
}

export default ValidatorPage;

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
