import { FC } from "react";

const WarningBanner: FC = () => {
  return (
    <div className="bg-[#FF486E] font-semibold text-sm text-white items-center text-center py-2 z-[9999999]">
      <div className="flex items-center">
        <div className="inline-flex items-center justify-center">
          <span>The dYdX testnet (dydx-testnet-1) is currently shut down in preparation for Testnet 2. The data is frozen until Testnet 2 launches.</span>
        </div>
      </div>
    </div>
  );
};

export default WarningBanner;
