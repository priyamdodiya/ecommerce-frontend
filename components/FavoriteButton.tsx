"use client";
import { Heart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

interface Product {
  id: number;
  name: string;
}

interface FavoriteButtonProps {
  showProduct?: boolean;
  product?: Product;
}

const FavoriteButton = ({ showProduct = false }: FavoriteButtonProps) => {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const wishlistCount = wishlistItems.length;

  return (
    <>
      {!showProduct ? (
        <Link href={"/wishlist"} className="group relative">
          <Heart className="w-5 h-5 hover:text-shop_light_green hoverEffect" />
          <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
            {wishlistCount}
          </span>
        </Link>
      ) : (
        <button className="group relative hover:text-shop_light_green hoverEffect border border-shop_light_green/80 hover:border-shop_light_green p-1.5 rounded-sm">
          <Heart className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect mt-.5 w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default FavoriteButton;