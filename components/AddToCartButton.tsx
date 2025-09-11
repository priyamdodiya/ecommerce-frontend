"use client";
import React from "react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { addToCart, CartItem } from "@/app/store/slices/user/cartSlice";
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
  const { loading } = useSelector((state: RootState) => state.cart);

  const [itemCount, setItemCount] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const [cartItem, setCartItem] = React.useState<CartItem | null>(null);

  const discountAmount =
    product?.discount && product.price
      ? (product.price * product.discount) / 100
      : 0;

  const finalPrice = product?.price ? product.price - discountAmount : 0;

  const handleAddToCart = async () => {
    if (!product?.id) return;

    const resultAction = await dispatch(
      addToCart({ productId: product.id, quantity: itemCount })
    );

    if (addToCart.fulfilled.match(resultAction)) {
      setCartItem(resultAction.payload);
      setAdded(true);
    }
  };

  const isOutOfStock = (product?.stock ?? 0) === 0;

  return (
    <div className="w-full space-y-3">
      {added && cartItem && (
        <>
          <div className="text-sm">
            <span className="text-xs text-darkColor/80">Quantity</span>
            <QuantityButtons
              value={itemCount}
              onChange={setItemCount}
              cartId={cartItem.id}
              stock={product.stock}
              onRemove={()=>{
                setAdded(false);
                setCartItem(null);
                setItemCount(1);
              }}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter amount={finalPrice * itemCount} />
          </div>
        </>
      )}

      {!added && (
        <Button
          onClick={handleAddToCart}
          disabled={loading || isOutOfStock}
          className={cn(
            "w-full bg-shop_dark_green/80 text-lightBg shadow-none border border-shop_dark_green/80 font-semibold tracking-wide text-white hover:bg-shop_dark_green hover:border-shop_dark_green hoverEffect",
            className
          )}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {loading
            ? "Adding..."
            : isOutOfStock
            ? "Out of Stock"
            : "Add to Cart"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;