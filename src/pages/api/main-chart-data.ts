import { getMainChartData } from "@/api";
import { PageConfig } from "next";
import { NextRequest } from "next/server";

export const config: PageConfig = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const data = await getMainChartData();

  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
      "cache-control": "max-age=1, s-maxage=1, stale-while-revalidate=59",
    },
  });
}
