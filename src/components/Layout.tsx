import { ComponentProps } from "react";
import WarningBanner from "./WarningBanner";
import Navbar from "./Navbar";

function Layout({ children, ...props }: ComponentProps<"main">) {
  return (
    <main {...props}>
      <Navbar />
      <WarningBanner />
      <div className="md:px-4">
        <div className="max-w-screen-lg mx-auto">{children}</div>
      </div>
    </main>
  );
}

export default Layout;
