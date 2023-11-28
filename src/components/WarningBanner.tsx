import { FC } from "react";

const WarningBanner: FC = () => {
  return (
    <div className="bg-[#FF486E] font-semibold text-sm text-white items-center text-center py-2 z-[9999999]">
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center justify-center">
          <span>Data on this dashboard will not be accurate until there is significant trading activity on dYdX v4.</span>
        </div>
      </div>
    </div>
  );
};

export default WarningBanner;
