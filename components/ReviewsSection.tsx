import React from "react";
// import ReviewCard from "./ReviewCard";
import ReviewImageCarousel from "./ReviewImageCarousel";
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

interface ReviewsSectionProps {
  averageRating: number;
  totalReviews: number;
  ratingCounts: number[];
  reviews: Review[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <div className="w-full md:w-1/2 p-4 md:p-6 bg-white rounded-lg space-y-6">
      <ReviewImageCarousel reviews={reviews} />
      <div className="space-y-4 pl-15">
      </div>
    </div>
  );
};

export default ReviewsSection;
