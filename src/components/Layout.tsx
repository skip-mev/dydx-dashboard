import { ComponentProps } from "react";
import Navbar from "./Navbar";
import WarningBanner from "./WarningBanner";

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
