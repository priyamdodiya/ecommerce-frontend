"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useState } from "react";
import StarRating from "./StarRating";
import ReviewPopup from "./ReviewPopup";
import NoAccess from "./NoAccess";
import { SanityImageCrop, SanityImageHotspot } from "@/sanity.types";

interface SanityImage {
  asset?: { _ref: string; _type: "reference" };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  _type: "image";
  _key: string;
}

interface Props {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingCounts: number[];
  activeImage: SanityImage | undefined;
}

const ProductReviewSection = ({
  productId,
  averageRating,
  totalReviews,
  ratingCounts,
  activeImage,
}: Props) => {
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [showNoAccess, setShowNoAccess] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const handleReviewButtonClick = () => {
    if (isSignedIn && user) {
      setShowReviewPopup(true);
    } else {
      setShowNoAccess(true);
    }
  };

  return (
    <div className="flex flex-col gap-4 pl-28">
      <div className="w-full border-t-gray-200 mt-5" />
      <div className="space-y-4 max-w-sm">
        <h2 className="text-xl font-bold text-gray-800">Customer reviews</h2>
        <div className="flex items-center gap-3">
          <StarRating
            productId={productId}
            averageRating={averageRating}
            totalReviews={totalReviews}
            ratingCounts={ratingCounts}
            disableHoverEffect={true}
          />
          <span className="text-lg font-semibold text-gray-800">
            {averageRating.toFixed(1)} out of 5
          </span>
        </div>
        <p className="text-gray-600 text-sm">{totalReviews} global ratings</p>
        <div className="space-y-2">
          {ratingCounts.slice().reverse().map((count, index) => {
            const star = 5 - index;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-blue-600 hover:underline cursor-pointer w-10">
                  {star} star
                </span>
                <div className="relative flex-1 h-3 bg-gray-200 rounded-sm overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-shop_light_green"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-700 w-10 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="py-4 md:py-4 space-y-2 md:space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-darkColor">
          Review this product
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Share your thoughts with other customers
        </p>
        <button
          onClick={handleReviewButtonClick}
          className="w-full md:w-auto px-6 py-2 bg-shop_dark_green/80 hover:bg-shop_dark_green rounded-full text-white transition-colors duration-200 ease-in-out"
        >
          Write a product review
        </button>
      </div>

      {showReviewPopup && (
        <ReviewPopup
          activeImage={activeImage}
          productId={productId}
          userId={user?.id || ""}
          isOpen={showReviewPopup}
          onClose={() => setShowReviewPopup(false)}
          averageRating={averageRating}
          totalReviews={totalReviews}
          ratingCounts={ratingCounts}
        />
      )}

      {showNoAccess && (
        <NoAccess
          details="To write a review, please sign in or create an account."
          onClose={() => setShowNoAccess(false)}
        />
      )}
    </div>
  );
};

export default ProductReviewSection;