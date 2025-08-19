"use client";
import { SanityImageCrop, SanityImageHotspot } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import ReviewPopup from "./ReviewPopup";
import NoAccess from "./NoAccess";
import { useAuth, useUser } from "@clerk/nextjs";

interface Props {
  images?: Array<{
    asset?: { _ref: string; _type: "reference" };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  isStock?: number | undefined;
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingCounts: number[];
}

const ImageView = ({
  images = [],
  isStock,
  productId,
  averageRating,
  totalReviews,
  ratingCounts,
}: Props) => {
  const [active, setActive] = useState(images[0]);
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
    <div className="w-full md:w-1/2 space-y-2 md:space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={active?._key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-h-[550px] min-h-[450px] border border-darkColor/10 rounded-md group overflow-hidden"
        >
          {active && (
            <Image
              src={urlFor(active).url()}
              alt="productImage"
              width={700}
              height={700}
              priority
              className={`w-full h-96 max-h-[550px] min-h-[500px] object-contain group-hover:scale-110 hoverEffect rounded-md ${
                isStock === 0 ? "opacity-50" : ""
              }`}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-6 gap-2 h-20 md:h-24">
        {images?.map((image) => (
          <button
            key={image?._key}
            onClick={() => setActive(image)}
            className={`border rounded-md overflow-hidden ${
              active?._key === image?._key
                ? "border-darkColor opacity-100"
                : "opacity-80"
            }`}
          >
            <Image
              src={urlFor(image).url()}
              alt={`Thumbnail ${image._key}`}
              width={100}
              height={100}
              className="w-full h-auto object-contain"
            />
          </button>
        ))}
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
          activeImage={active}
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

export default ImageView;