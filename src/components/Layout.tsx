import { FC, PropsWithChildren } from "react";
import NavBar from "./NavBar";
import WarningBanner from "./WarningBanner";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <NavBar />
      <WarningBanner />
      <div className="px-4">
        <div className="max-w-screen-lg mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
