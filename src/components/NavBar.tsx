/* eslint-disable @next/next/no-img-element */
import { FC } from "react";

const NavBar: FC = () => {
  return (
    <nav className="p-4">
      <div className="max-w-screen-lg mx-auto">
        <img className="h-9" src="/skip-logo.svg" alt="skip-logo" />
      </div>
    </nav>
  );
};

export default NavBar;
