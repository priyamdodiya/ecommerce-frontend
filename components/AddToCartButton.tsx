"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { addToCart } from "@/app/store/slices/user/cartSlice";
import { Product } from "@/app/store/slices/user/productSlice";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  className,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.cart);

  const [localLoading, setLocalLoading] = useState(false);

  // ✅ check if product already exists in cart
  const cartItem = items.find((i) => i.productId === product.id);

  const discountAmount =
    product?.discount && product.price
      ? (Number(product.price) * product.discount) / 100
      : 0;

  const finalPrice = product?.price
    ? Number(product.price) - discountAmount
    : 0;

  const handleAddToCart = async () => {
    if (!product?.id) return;
    setLocalLoading(true);
    const resultAction = await dispatch(
      addToCart({ productId: product.id, quantity: 1 })
    );
    setLocalLoading(false);
  };

  const isOutOfStock = (product?.stock ?? 0) === 0;

  if (cartItem) {
    return (
      <div className="w-full space-y-3">
        <div className="text-sm">
          <span className="text-xs text-darkColor/80">Quantity</span>
          <QuantityButtons
            value={cartItem.quantity}
            onChange={() => {}}
            cartId={cartItem.id}
            stock={product.stock}
          />
        </div>

        <div className="flex items-center justify-between border-t pt-1">
          <span className="text-xs font-semibold">Subtotal</span>
          <PriceFormatter amount={finalPrice * cartItem.quantity} />
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={localLoading || isOutOfStock}
      className={cn(
        "w-full bg-shop_dark_green/80 text-lightBg shadow-none border border-shop_dark_green/80 font-semibold tracking-wide text-white hover:bg-shop_dark_green hover:border-shop_dark_green hoverEffect",
        className
      )}
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      {localLoading
        ? "Adding..."
        : isOutOfStock
        ? "Out of Stock"
        : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
