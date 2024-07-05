import { FC } from "react";

const WarningBanner: FC = () => {
  return (
    <div className="bg-dydx-alert font-semibold text-sm text-white items-center text-center py-2 z-[9999999]">
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center justify-center">
          <span>
            The dashboard is currently under transition to another community partner. Please wait for any further updates.
          </span>
        </div>
      </div>
    </div>
  );
};

export default WarningBanner;
