import { FC } from "react";

const WarningBanner: FC = () => {
  return (
    <div className="bg-[#FF486E] font-semibold text-sm text-white py-2 z-[9999999]">
        <div className="overflow-hidden">
        <div className="w-[5000px] flex items-center">
          <div className="w-[1000px] inline-flex items-center justify-around">
            <span>The dYdX testnet (dydx-testnet-1) is currently shut down in preparation for Testnet 2. The data is frozen until Testnet 2 launches.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningBanner;
