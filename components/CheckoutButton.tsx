"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import {
  createCheckoutSession,
  resetCheckout,
  CheckoutCartItem,
  OrderSummary,
} from "@/app/store/slices/user/checkoutSlice";

interface CheckoutButtonProps {
  items: CheckoutCartItem[];
  orderSummary: OrderSummary;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ items, orderSummary }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, session } = useSelector(
    (state: RootState) => state.checkout
  );

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLICK_KEY!);

  const handleCheckout = async () => {
    if (!items || items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    await dispatch(
      createCheckoutSession({
        cartItems: items,
        orderSummary,
      })
    );
  };

  useEffect(() => {
    const redirectToStripe = async () => {
      if (session?.url) {
        const stripe = await stripePromise;
        if (!stripe) {
          toast.error("Stripe failed to load");
          return;
        }
        window.location.href = session.url;
      }
    };
    redirectToStripe();
  }, [session]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetCheckout());
    }
  }, [error, dispatch]);

  return (
    <Button
      onClick={handleCheckout}
      className="w-full rounded-full font-semibold tracking-wide hoverEffect"
      size="lg"
      disabled={loading}
    >
      {loading ? "Processing..." : "Proceed to Checkout"}
    </Button>
  );
};

export default CheckoutButton;