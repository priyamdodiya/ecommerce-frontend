"use client";
import React from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { updateCartQuantity, deleteCartItem } from "@/app/store/slices/user/cartSlice";
import { toast } from "react-hot-toast";

interface QuantityButtonsProps {
  value: number;
  onChange: (newValue: number) => void;
  cartId: number;
  className?: string;
  stock: number;
  onRemove?:()=>void;
}

const QuantityButtons: React.FC<QuantityButtonsProps> = ({ value, onChange, cartId, stock, className, onRemove }) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleDecrease = async () => {
    if (value > 1) {
      const newValue = value - 1;
      onChange(newValue);
      await dispatch(updateCartQuantity({ cartId, quantity: newValue }));
      toast.success(`Quantity decreased to ${newValue}`);
    } else {
      await dispatch(deleteCartItem({ cartId }));
      toast.success("Item removed from cart");
      onChange(0);
      if(onRemove) onRemove();
    }
  };

  const handleIncrease = async () => {
    if (value >= stock) {
      toast.error(`Only ${stock} items available in stock!`);
      return;
    }
    const newValue = value + 1;
    onChange(newValue);
    await dispatch(updateCartQuantity({ cartId, quantity: newValue }));
    toast.success(`Quantity increased to ${newValue}`);
  };

  if (value === 0) return null;

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        onClick={handleDecrease}
        variant="outline"
        size="icon"
        className="w-6 h-6 border-[1px] hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Minus />
      </Button>
      <span className="font-semibold text-sm w-6 text-center text-darkColor">{value}</span>
      <Button
        onClick={handleIncrease}
        variant="outline"
        size="icon"
        className="w-6 h-6 border-[1px] hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityButtons;