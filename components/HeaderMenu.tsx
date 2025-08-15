"use client";
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:inline-flex w-1/3 justify-center items-center gap-7 text-sm capitalize font-semibold text-lightColor">
      {headerData?.map((item) => (
        <Link
          key={item?.title}
          href={item?.href}
          className={`relative group hover:text-shop_light_green transition-colors duration-300 ${
            pathname === item?.href && "text-shop_light_green"
          }`}
        >
          {item?.title}
          <span
            className={`absolute -bottom-0.5 right-1/2 h-0.5 bg-shop_light_green transition-all duration-300 ease-in-out ${
              pathname === item?.href ? "w-1/2" : "w-0 group-hover:w-1/2"
            }`}
          ></span>
          <span
            className={`absolute -bottom-0.5 left-1/2 h-0.5 bg-shop_light_green transition-all duration-300 ease-in-out ${
              pathname === item?.href ? "w-1/2" : "w-0 group-hover:w-1/2"
            }`}
          ></span>
        </Link>
      ))}
    </div>
  );
};

export default HeaderMenu;
