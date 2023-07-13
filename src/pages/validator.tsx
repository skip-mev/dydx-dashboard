import Layout from "@/components/Layout";
import Link from "next/link";

function ValidatorPage() {
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
        <h1 className="font-mono font-bold text-3xl">SG-1</h1>
      </div>
      <div>
        <p className="font-mono font-bold text-xl">
          Validator&apos;s Historical Orderbook Discrepancy
        </p>
      </div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed totam
        repudiandae expedita id! Et totam animi repellendus ullam at similique
        aliquam, consequuntur, soluta accusamus qui repudiandae, non odit ipsam
        pariatur?
      </p>
    </Layout>
  );
}

export default ValidatorPage;
