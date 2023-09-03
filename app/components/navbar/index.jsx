import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <div className="w-full h-14 bg-emerald-700 top-0">
        <div className="container md:container md:mx-auto h-full">
          <div className="flex justify-between items-center h-full">
          <div className="">
            <Link href="/">
              Philosopher.ai
            </Link>
          </div>
            <ul className="hidden md:flex gap-x-6 text-white">
              <li>
                <Link href="/about">
                  <p>About Project</p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;