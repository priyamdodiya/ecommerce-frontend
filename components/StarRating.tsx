"use client";

import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface StarRatingProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingCounts: number[];
  disableHoverEffect?: boolean; // New prop to control hover behavior
}

const StarRating = ({
  averageRating,
  totalReviews,
  ratingCounts,
  disableHoverEffect = false, // Default to false (hover enabled)
}: StarRatingProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const roundedAverage = Math.round(averageRating);

  return (
    <div
      className="relative flex items-center gap-0.5 text-xs w-fit"
      onMouseEnter={() => !disableHoverEffect && setIsHovered(true)}
      onMouseLeave={() => !disableHoverEffect && setIsHovered(false)}
    >
      {[...Array(5)].map((_, index) => (
        <span key={index}>
          {index < roundedAverage ? (
            <FaStar size={14} className="text-shop_light_green" fill={"#3b9c3c"} />
          ) : (
            <FaRegStar size={14} className="text-gray-400" />
          )}
        </span>
      ))}
      <p className="font-semibold text-sm ml-1 text-gray-700">
        {averageRating.toFixed(1)}
      </p>
      <p className="font-semibold text-sm ml-1 text-gray-500">
        ({totalReviews} reviews)
      </p>

      <AnimatePresence>
        {isHovered && totalReviews > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-64"
          >
            <div className="space-y-2">
              <h3 className="text-sm font-semibold mb-2">Customer Reviews</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-gray-800">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <span key={index}>
                      {index < roundedAverage ? (
                        <FaStar size={16} className="text-yellow-400" />
                      ) : (
                        <FaRegStar size={16} className="text-gray-300" />
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {ratingCounts.slice().reverse().map((count, index) => {
                const star = 5 - index;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-4 text-xs font-medium text-gray-700">
                      {star} star
                    </span>
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-shop_dark_green"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
              <p className="text-xs text-center text-gray-500 mt-2">
                Based on {totalReviews} reviews
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StarRating;