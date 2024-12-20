'use client';

import React, { useState } from "react";
import Link from "next/link";
import { WalletButton } from "@/app/wallet/AppWalletProvider";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

const NavBarItem = ({ title, href, classProps }: { title: string; href: string; classProps?: string }) => (
  <li className={`mx-4 cursor-pointer ${classProps}`}>
    <Link href={href}>{title}</Link>
  </li>
);

export default function Navbar( { isLightMode } : { isLightMode: boolean }) {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className="w-full flex items-center px-56 py-4">
      {/* Left Section: Logo */}
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <Image src={ isLightMode ? "/logo2.png" : "/logo1.png"} alt="logo" width={128} height={64} className="cursor-pointer" />
      </div>

      {/* Middle Section: Centered Links */}
      <div className="flex-1 flex justify-center">
        <ul className="text-gray-700 font-bold md:flex hidden list-none flex-row justify-center items-center">
          {[
            { title: "Home", href: "/" },
            { title: "Lend/Borrow", href: "/lend-borrow" },
            { title: "Swap", href: "/swap" },
            { title: "Token", href: "/token" },
          ].map((item, index) => (
            <NavBarItem key={index} title={item.title} href={item.href} />
          ))}
        </ul>
      </div>

      {/* Right Section: Wallet Button */}
      <div className="md:flex-[0.5] flex-initial flex justify-end items-center">
        <WalletButton
            style={{
                //backgroundColor: "#e5e7eb", // bg-gray-200
                backgroundColor: "#fcd303", // bg-gray-200
                color: "white", // text-gray-800
                fontWeight: "bold",
                fontSize: "16px", // text-base
                padding: "0.5rem 2.5rem", // py-2 px-6
                borderRadius: "30px", // rounded-full
                letterSpacing: "0.05em", // Adjust letter spacing
                transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                padding: "0.3rem 1.2rem",
            }}
        />
      </div>

      {/* Mobile Menu Icon */}
      <div className="flex relative md:hidden">
        {!toggleMenu && (
          <HiMenuAlt4 fontSize={28} className="text-gray-700 cursor-pointer" onClick={() => setToggleMenu(true)} />
        )}
        {toggleMenu && (
          <AiOutlineClose fontSize={28} className="text-gray-700 cursor-pointer" onClick={() => setToggleMenu(false)} />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed top-0 right-0 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md bg-white text-gray-700 animate-slide-in"
          >
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {[
              { title: "Home", href: "/" },
              { title: "Lend/Borrow", href: "/lend-borrow" },
              { title: "Swap", href: "/swap" },
              { title: "Token", href: "/token" },
            ].map((item, index) => (
              <NavBarItem key={index} title={item.title} href={item.href} classProps="my-2 text-lg" />
            ))}
            <li className="my-2">
              <WalletButton />
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}