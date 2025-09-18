"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { getProductById } from "@/app/store/slices/user/singleProductSlice";
import Container from "@/components/Container";
import PriceView from "@/components/PriceView";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import { RxBorderSplit } from "react-icons/rx";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";
import { CornerDownLeft, Truck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const SingleProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { product, loading, error } = useSelector(
    (state: RootState) => state.singleProduct
  );

  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setActive(`http://localhost:3001${product.images[0]}`);
    } else if (product?.image) {
      setActive(`http://localhost:3001${product.image}`);
    }
  }, [product]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <Container className="flex flex-col md:flex-row gap-10 py-10">
      {product && (
        <>
          {/* Product Image with hover functionality */}
          <div className="w-full md:w-1/2 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={active ?? "no-image"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full max-h-[550px] min-h-[450px] border border-darkColor/10 rounded-md group overflow-hidden flex items-center justify-center bg-white"
              >
                {active ? (
                  <Image
                    src={active}
                    alt={product.name}
                    height={500}
                    width={500}
                    className="w-full h-80 object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <p className="text-gray-400">No image available</p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Thumbnails */}
            {product?.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img: string, idx: number) => {
                  const url = `http://localhost:3001${img}`;
                  return (
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      key={idx}
                      src={url}
                      alt={`thumbnail-${idx}`}
                      onMouseEnter={() => setActive(url)}
                      className={`w-20 h-20 object-contain border rounded-md cursor-pointer ${
                        active === url ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 flex flex-col gap-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-sm text-gray-600 tracking-wide">
                {product.description}
              </p>
            </div>

            <div className="space-y-2 border-t border-b border-gray-200 py-5">
              <PriceView
                price={product?.price}
                discount={product?.discount}
                className="text-lg font-bold"
              />
              <p
                className={`px-4 py-1.5 text-sm text-center inline-block font-semibold rounded-lg ${
                  product?.stock === 0
                    ? "bg-red-100 text-red-600"
                    : "text-green-600 bg-green-100"
                }`}
              >
                {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            <div className="flex items-center gap-2.5 lg:gap-3">
              <AddToCartButton product={product} />
              <FavoriteButton showProduct={true} product={product} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2">
              <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
                <RxBorderSplit className="text-lg" />
                <p>Compare color</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
                <FaRegQuestionCircle className="text-lg" />
                <p>Ask a question</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
                <TbTruckDelivery className="text-lg" />
                <p>Delivery & Return</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
                <FiShare2 className="text-lg" />
                <p>Share</p>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="border border-lightColor/25 border-b-0 p-3 flex items-center gap-2.5">
                <Truck size={30} className="text-shop_orange" />
                <div>
                  <p className="text-base font-semibold text-black">
                    Free Delivery
                  </p>
                  <p className="text-sm text-gray-500 underline underline-offset-2">
                    Enter your Postal code for Delivery Availability.
                  </p>
                </div>
              </div>

              <div className="border border-lightColor/25 p-3 flex items-center gap-2.5">
                <CornerDownLeft size={30} className="text-shop_orange" />
                <div>
                  <p className="text-base font-semibold text-black">
                    Return Delivery
                  </p>
                  <p className="text-sm text-gray-500 ">
                    Free 30 days Delivery Returns.{" "}
                    <span className="underline underline-offset-2">Details</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};
export default SingleProductPage;
