"use client";
import React, { useState } from "react";
import { FaStar, FaUserCircle, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ReportModal, ThankYouModal } from "./ReportModals"; // Import the custom components

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
  const [showReportModal, setShowReportModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

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

  const handleReportClick = () => {
    setShowReportModal(true);
  };

  const handleReportSubmit = () => {
    setShowReportModal(false);
    setShowThankYouModal(true);
  };

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0 mb-6">
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
        <span className="ml-2 font-semibold text-orange-600">Verified Purchase</span>
      </p>

      {review.reviewImage && (
        <div className="mt-3 flex gap-2">
          <div className="relative h-28 w-28 overflow-hidden rounded-md border">
            <Image
              src={urlFor(review.reviewImage).url()}
              alt={`Review image from ${review.reviewer}`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-sm">
        {showFeedback ? (
          <div className="flex items-center text-shop_light_green">
            <FaCheckCircle className="mr-1" />
            Thank you for your feedback.
          </div>
        ) : (
          <>
            <button
              className="rounded-full border px-3 py-1 hover:bg-gray-100"
              onClick={handleHelpfulClick}
            >
              Helpful
            </button>
          </>
        )}
        <button className="text-gray-500 hover:underline" onClick={handleReportClick}>
          Report
        </button>
      </div>

      <ReportModal
        isOpen={showReportModal}
        onRequestClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
      />

      <ThankYouModal
        isOpen={showThankYouModal}
        onRequestClose={() => setShowThankYouModal(false)}
      />
    </div>
  );
};

export default ReviewCard;