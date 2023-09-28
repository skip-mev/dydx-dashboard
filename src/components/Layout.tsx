import { ComponentProps } from "react";
import NavBar from "./NavBar";

function Layout({ children, ...props }: ComponentProps<"main">) {
  return (
    <main {...props}>
      <NavBar />
      <div className="px-4">
        <div className="max-w-screen-lg mx-auto">{children}</div>
      </div>
    </main>
  );
}

export default Layout;
