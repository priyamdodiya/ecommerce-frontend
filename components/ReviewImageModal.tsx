import React, { useState } from "react";
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

interface ReviewImageModalProps {
  review: Review;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalReviews: number;
}

const ReviewImageModal: React.FC<ReviewImageModalProps> = ({
  review,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  totalReviews,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  if (!review) {
    return null;
  }

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      {/* Modal Content */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 z-50 bg-black/30 p-2 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Left Side: Image and Navigation */}
        <div className="relative flex-1 bg-gray-900 flex items-center justify-center p-4">
          <div className="relative w-full h-full">
            <Image
              src={urlFor(review.reviewImage!).url()}
              alt="Selected review image"
              fill
              className="object-contain"
            />
          </div>

          {/* Previous Button */}
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm text-white flex items-center justify-center cursor-pointer hover:bg-white/50 transition-colors"
            aria-label="Previous review"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          {/* Next Button */}
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm text-white flex items-center justify-center cursor-pointer hover:bg-white/50 transition-colors"
            aria-label="Next review"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        {/* Right Side: Review Details */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Review Details</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 font-medium">
                  {currentIndex + 1} of {totalReviews}
                </span>
                {/* Like button */}
                <button onClick={toggleLike} aria-label="Like review">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-7 h-7 transition-colors duration-200 ${
                      isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <path d="m11.645 20.917-7.245-7.245a5.794 5.794 0 0 1 0-8.196l.794-.794a5.794 5.794 0 0 1 8.196 0l.794.794a5.794 5.794 0 0 1 0 8.196l-7.245 7.245Z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex items-center mb-2">
              {/* Rating stars */}
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.376 2.45a1 1 0 00-.364 1.118l1.287 3.961c.3.921-.755 1.688-1.54 1.118l-3.376-2.45c-.36-.26-.82-.26-1.18 0l-3.377 2.45c-.784.57-1.84-.197-1.54-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.094 9.387c-.783-.57-.38-1.81.588-1.81h4.168a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm font-semibold text-gray-800">
                {review.reviewTitle}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{review.reviewer}</p>
            <p className="text-gray-700 leading-relaxed text-sm">{review.reviewText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewImageModal;