"use client";
import React from "react";
import { Product } from "@/app/store/slices/user/productSlice";
import Title from "./Title";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";
import AddToWishlistButton from "./AddToWishlistButton";
import Link from "next/link";
import { Flame } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { getProductById } from "@/app/store/slices/user/singleProductSlice";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const BASE_URL = "http://localhost:3001";
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleImageClick = () => {
    if (product?.id) {
      dispatch(getProductById(product.id));
      router.push(`/product/${product.id}`);
    }
  };
  return (
    <div className="text-sm border-[1px] rounded-md border-darkBlue/20 group bg-white">
      <div
        className="relative group overflow-hidden bg-shop_light_bg cursor-pointer"
        onClick={handleImageClick}
      >
        {product?.image && (
          <img
            src={`${BASE_URL}${product.image}`}
            alt={product.name}
            width={500}
            height={500}
            className={`w-full h-64 object-contain overflow-hidden transition-transform bg-shop_light_bg duration-500
            ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
          />
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
        <Title className="text-sm line-clamp-1">{product?.name}</Title>

        {product?.description && (
          <p className="text-gray-600 text-xs line-clamp-2">
            {product.description}
          </p>
        )}
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

        <div className="flex items-center gap-2">
          <p className="text-gray-600 line-through">₹{product?.price}</p>
          {product?.discountPrice ? (
            <p className="text-green-600 font-semibold">
              ₹{product.discountPrice}
            </p>
          ) : (
            <PriceView
              price={product?.price}
              discount={product?.discount}
              className="text-sm"
            />
          )}
        </div>
      </div>
      <div className="px-3 pb-3"><AddToCartButton product={product} className="w-36 rounded-full" />
      </div>
    </div>
  );
};
export default ProductCard;