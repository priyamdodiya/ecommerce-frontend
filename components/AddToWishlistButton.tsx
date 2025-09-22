import { cn } from "@/lib/utils";
import { Product } from "@/app/store/slices/user/productSlice";
import { Heart } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "@/app/store/slices/user/wishlistSlice";

interface AddToWishlistButtonProps {
  product: Product;
  className?: string;
  inline?: boolean;
}

const AddToWishlistButton: React.FC<AddToWishlistButtonProps> = ({
  product,
  className,
  inline = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const isInWishlist = wishlistItems.some(item => item.productId === product.id);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);


  const handleToggleWishlist = async () => {
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(product.id)).unwrap();
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
      }
    } catch (error) {
      console.error("Wishlist API error:", error);
    }
  };

  return (
    <div className={cn(inline ? "relative inline-block" : "absolute top-2 right-2 z-10", className)}>
      <button
        className={cn(
          "p-2.5 rounded-full transition-colors duration-200",
          isInWishlist
            ? "bg-shop_dark_green text-white"
            : "bg-shop_lighter_bg hover:bg-shop_dark_green hover:text-white"
        )}
        onClick={handleToggleWishlist}
      >
        <Heart size={15} />
      </button>
    </div>
  );
};

export default AddToWishlistButton;
