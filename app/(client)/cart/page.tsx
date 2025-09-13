"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import {
  getCartItems,
  selectCart,
  updateCartQuantity,
  deleteCartItem,
} from "@/app/store/slices/user/cartSlice";
import { getProducts } from "@/app/store/slices/user/productSlice";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(selectCart);
  const { data: productsData = [], loading: productsLoading } = useSelector(
    (state: RootState) =>
      state.userProduct.products || { data: [], loading: false }
  );

  useEffect(() => {
    dispatch(getCartItems());
    dispatch(getProducts());
  }, [dispatch]);

  if (loading || productsLoading) return <p>Loading cart...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const BASE_URL = "http://localhost:3001";

  let subtotal = 0;
  let discountTotal = 0;

  items.forEach((item) => {
    const product = productsData?.find((p) => p.id === item.productId);
    if (!product) return;
    const quantity = item.quantity;
    const productPrice = product.price;
    const productDiscountPrice =
      product.discountPrice ??
      product.price - (product.price * (product.discount ?? 0)) / 100;
    subtotal += productPrice * quantity;
    discountTotal += (productPrice - productDiscountPrice) * quantity;
  });
  const total = subtotal - discountTotal;

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLICK_KEY!);

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        console.log("stripe failed to load");
        return;
      }

      const cartData = items.map((item) => {
        const product = productsData.find((p) => p.id === item.productId);
        return {
          product: {
            name: product?.name,
            image: product?.image,
          },
          price: product?.price,
          quantity: item.quantity,
        };
      });

      const res = await axios.post(
        "http://localhost:3001/api/payment/checkout",
        {
          cartItems: cartData,
          orderSummary: {
            subTotal: subtotal,
            discount: discountTotal,
            total: total,
          },
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { id, url } = res.data;
      if (!id || !url) {
        console.log("Checkout session not created properly");
        return;
      }
      window.location.href = url;
    } catch (error) {
      console.log("error", error);
    }
  };


  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      <Container>
        <div className="flex items-center gap-2 py-5">
          <ShoppingBag className="text-darkColor" />
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-3 md:gap-8 mb-6">
            <div className="lg:col-span-2 rounded-lg">
              <div className="border bg-white rounded-md">
                {items.map((item, index) => {
                  const product = productsData?.find(
                    (p) => p.id === item.productId
                  );
                  if (!product) return null;

                  const quantity = item.quantity;
                  const productPrice = product.price;
                  const productDiscountPrice =
                    product.discountPrice ??
                    product.price -
                    (product.price * (product.discount ?? 0)) / 100;

                  return (
                    <div
                      key={item.id}
                      className={`p-2.5 flex items-center justify-between gap-5 border-b ${index === items.length - 1 ? "border-b-0" : ""
                        }`}
                    >
                      <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                        <Link
                          href={`/product/${product.id}`}
                          className="border p-1 rounded-md overflow-hidden group"
                        >
                          {product.image && (
                            <img
                              src={`${BASE_URL}${product.image}`}
                              alt={product.name}
                              width={500}
                              height={500}
                              className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                            />
                          )}
                        </Link>
                        <div className="h-full flex flex-1 flex-col justify-between py-1">
                          <div className="flex flex-col gap-1">
                            <h2 className="text-base font-semibold line-clamp-1">
                              {product.name}
                            </h2>
                            <p className="text-sm">
                              Status:{" "}
                              <span className="font-semibold">
                                {product.stock > 0
                                  ? "Available"
                                  : "Out of Stock"}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trash
                              className="w-5 h-5 text-gray-500 hover:text-red-600 hoverEffect cursor-pointer"
                              onClick={async () => {
                                try {
                                  await dispatch(
                                    deleteCartItem({ cartId: item.id })
                                  );
                                  toast.success("Item removed from cart");
                                } catch {
                                  toast.error("Failed to remove item");
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start justify-between h-36 md:h-44 p-1">
                        <span className="font-bold text-lg">
                          <PriceFormatter
                            amount={productPrice * quantity}
                            className="font-bold text-black"
                          />
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={async () => {
                              if (item.quantity > 1) {
                                await dispatch(
                                  updateCartQuantity({
                                    cartId: item.id,
                                    quantity: item.quantity - 1,
                                  })
                                );
                                toast.success("Quantity decreased");
                              } else {
                                await dispatch(
                                  deleteCartItem({ cartId: item.id })
                                );
                                toast.success("Item removed from cart");
                              }
                            }}
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            size="sm"
                            onClick={async () => {
                              if (item.quantity >= product.stock) {
                                toast.error(`Only ${product.stock} in stock`);
                                return;
                              }
                              await dispatch(
                                updateCartQuantity({
                                  cartId: item.id,
                                  quantity: item.quantity + 1,
                                })
                              );
                              toast.success("Quantity increased");
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-between items-center border-t pt-3 mt-3">
                  <Button className="m-5 font-semibold" variant="destructive">
                    Reset Cart
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <div className="lg:col-span-1">
                <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>SubTotal</span>
                      <PriceFormatter amount={subtotal} />
                    </div>
                    <div className="flex items-center justify-between text-green-600">
                      <span>Discount</span>
                      <PriceFormatter amount={total} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-semibold text-lg">
                      <span>Total</span>
                      <PriceFormatter
                        amount={discountTotal}
                        className="text-lg font-bold text-black"
                      />
                    </div>
                    <Button
                      onClick={handleCheckout}
                      className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-md mt-5">
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full mt-4">
                        Add New Address
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
export default CartPage;