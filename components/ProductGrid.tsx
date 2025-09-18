"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import {
  getProducts,
  getProductsByCategory,
  Product,
} from "@/app/store/slices/user/productSlice";

import Container from "./Container";
import HomeTabBar from "./HomeTabBar";
import { productType } from "@/constants/data";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const ProductGrid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.userProduct
  );

  const [selectedTab, setSelectedTab] = useState(productType[0]?.value || "all");

  useEffect(() => {
    if (selectedTab === "all") {
      dispatch(getProducts());
    } else {
      dispatch(getProductsByCategory(selectedTab));
    }
  }, [dispatch, selectedTab]);

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      <HomeTabBar selectedTab={selectedTab} onTabSelect={setSelectedTab} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Product is loading...</span>
          </motion.div>
        </div>
      ) : products?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">
          {products.map((product: Product) => (
            <AnimatePresence key={product.id}>
              <motion.div
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCard key={product.id} product={product} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
};

export default ProductGrid;
