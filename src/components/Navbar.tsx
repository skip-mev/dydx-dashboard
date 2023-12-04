import Link from "next/link";
import { SkipIcon } from "./icons/Skip";

const Navbar = () => {
  return (
    <nav className="p-4">
      <div className="max-w-screen-lg flex justify-center md:justify-start mx-auto">
        <Link href="/" className="hover:text-white/50">
          <SkipIcon className="h-8" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
