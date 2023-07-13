import { FC, PropsWithChildren } from "react";
import NavBar from "./NavBar";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div className="px-4">
        <div className="max-w-screen-lg mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
