"use client";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import Title from "./Title";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";
import AddToWishlistButton from "./AddToWishlistButton";
import StarRating from "./StarRating";

interface ProductWithReviewStats extends Product {
  reviewStats?: { rating: number }[];
}

const ProductCard = ({ product }: { product: ProductWithReviewStats }) => {
  const totalReviews = product?.reviewStats?.length || 0;
  const ratingCounts = [0, 0, 0, 0, 0];
  let totalRatingSum = 0;

  if (totalReviews > 0) {
    product.reviewStats?.forEach((review) => {
      ratingCounts[review.rating - 1]++;
      totalRatingSum += review.rating;
    });
  }

  const averageRating = totalReviews > 0 ? totalRatingSum / totalReviews : 0;

  return (
    <div className="text-sm border-[1px] rounded-md border-darkBlue/20 group bg-white">
      <div className="relative group overflow-hidden bg-shop_light_bg">
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image
              src={urlFor(product.images[0]).url()}
              alt="productImage"
              width={500}
              height={500}
              priority
              className={`w-full h-64 object-contain overflow-hidden transition-transform bg-shop_light_bg duration-500  
              ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"
                }`}
            />
          </Link>
        )}

        <AddToWishlistButton product={product} />

        {product?.status === "sale" ? (
          <p className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 rounded-full group-hover:border-lightGreen hover:text-shop_dark_green hoverEffect">
            Sale!
          </p>
        ) : (
          <Link
            href={"/deal"}
            className="absolute top-2 left-2 z-10 border border-shop_orange/50 p-1 rounded-full group-hover:border-shop_orange hover:text-shop_dark_green hoverEffect"
          >
            <Flame
              size={18}
              fill="#fb6c08"
              className="text-shop_orange/50 group-hover:text-shop_orange hoverEffect"
            />
          </Link>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">

        {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-lightText">
            {product.categories
              .map((cat: unknown) => {
                if (!cat) return "";

                if (typeof cat === "object" && cat !== null) {
                  const c = cat as { title?: string; name?: string };
                  return c.title || c.name || "";
                }
                if (typeof cat === "string") {
                  return cat;
                }

                return "";
              })
              .filter(Boolean)
              .join(", ")}
          </p>
        )}
        <Title className="text-sm line-clamp-1">{product?.name}</Title>
        <StarRating
          productId={product._id}
          averageRating={averageRating}
          totalReviews={totalReviews}
          ratingCounts={ratingCounts}
          disableHoverEffect={true}
        />

        <div className="flex items-center gap-2.5">
          <p className="font-medium">In Stock</p>
          <p
            className={`${product?.stock === 0
                ? "text-red-600"
                : "text-shop_dark_green/80 font-semibold"
              }`}
          >
            {(product?.stock as number) > 0 ? product?.stock : "unavailable"}
          </p>
        </div>

        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-sm"
        />
      </div>

      <AddToCartButton product={product} className="w-36 rounded-full" />
    </div>
  );
};

export default ProductCard;