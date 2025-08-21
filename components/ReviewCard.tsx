"use client";
import React, { useState } from "react";
import { FaStar, FaUserCircle, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface Review {
  _id: string;
  reviewer: string;
  rating: number;
  reviewTitle: string;
  reviewText: string;
  reviewImage?: SanityImageSource;
  createdAt: string;
}

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleHelpfulClick = () => {
    setShowFeedback(true);
  };

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
      <div className="flex items-center gap-2">
        <FaUserCircle className="text-gray-400" size={28} />
        <p className="text-sm font-medium text-gray-800">{review.reviewer}</p>
      </div>

      <div className="flex items-center gap-2 mt-1">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            size={14}
            className={index < review.rating ? "text-shop_light_green" : "text-gray-300"}
          />
        ))}
        <span className="font-semibold text-gray-800">{review.reviewTitle}</span>
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Reviewed in India on {formatDate(review.createdAt)}
        <span className="text-orange-600 font-semibold ml-2">
          Verified Purchase
        </span>
      </p>

      {review.reviewImage && (
        <div className="flex gap-2 mt-3">
          <div className="relative w-28 h-28 border rounded-md overflow-hidden">
            <Image
              src={urlFor(review.reviewImage).url()}
              alt={`Review image from ${review.reviewer}`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 text-sm">
        {showFeedback ? (
          <div className="flex items-center text-shop_light_green">
            <FaCheckCircle className="mr-1" />
            Thank you for your feedback.
          </div>
        ) : (
          <>
            <button
              className="px-3 py-1 border rounded-full hover:bg-gray-100"
              onClick={handleHelpfulClick}
            >
              Helpful
            </button>
          </>
        )}
        <button className="text-gray-500 hover:underline">Report</button>
      </div>
    </div>
  );
};

export default ReviewCard;