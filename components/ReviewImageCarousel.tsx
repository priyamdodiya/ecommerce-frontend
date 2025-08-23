
"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import ReviewCard from "./ReviewCard";
import ReviewImageModal from "./ReviewImageModal";

interface Review {
  _id: string;
  reviewer: string;
  rating: number;
  reviewTitle: string;
  reviewText: string;
  reviewImage?: SanityImageSource;
  createdAt: string;
}

const ReviewImageCarousel: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const reviewsContainerRef = useRef<HTMLDivElement>(null);
  const [scrollThresholdPassed, setScrollThresholdPassed] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  // New state for modal functionality
  const [showModal, setShowModal] = useState(false);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (carouselRef.current) {
        const { scrollWidth, clientWidth } = carouselRef.current;
        setShowButtons(scrollWidth > clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [reviews]);

  useEffect(() => {
    const handleScroll = () => {
      if (reviewsContainerRef.current) {
        const { top } = reviewsContainerRef.current.getBoundingClientRect();
        const threshold = window.innerHeight * 0.5;

        if (top < threshold && !scrollThresholdPassed) {
          setScrollThresholdPassed(true);
        } else if (top >= threshold && scrollThresholdPassed) {
          setScrollThresholdPassed(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThresholdPassed]);

  const reviewsWithImages = reviews.filter((r) => r.reviewImage);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -208,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 208,
        behavior: "smooth",
      });
    }
  };

  const openModal = (index: number) => {
    setSelectedReviewIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleNext = () => {
    setSelectedReviewIndex((prevIndex) =>
      prevIndex === reviewsWithImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setSelectedReviewIndex((prevIndex) =>
      prevIndex === 0 ? reviewsWithImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <div className="space-y-2 w-[45.2vw] pl-15 mx-auto border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Reviews with images</h3>
          <a href="#" className="text-blue-500 text-sm">
            See all photos
          </a>
        </div>
        <div className="flex items-center relative">
          {showButtons && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 z-10 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm shadow-md flex items-center justify-center cursor-pointer hover:bg-white transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}

          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-2 pt-5 pb-5 p-2 hide-scrollbar"
          >
            {reviewsWithImages.map((review, index) => (
              <div
                key={review._id}
                className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 relative rounded-md overflow-hidden cursor-pointer"
                onClick={() => openModal(index)}
              >
                <Image
                  src={urlFor(review.reviewImage!).url()}
                  alt={`Review image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>

          {showButtons && (
            <button
              onClick={scrollRight}
              className="absolute right-0 z-10 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm shadow-md flex items-center justify-center cursor-pointer hover:bg-white transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}
        </div>
        <h3 className="text-lg pt-5 pb-5 font-bold text-gray-800">Top reviews from India</h3>
        <div
          ref={reviewsContainerRef}
          className={`max-h-[500px] overflow-hidden ${
            scrollThresholdPassed ? "overflow-y-auto hide-scrollbar" : ""
          }`}
        >
          {reviews.map((review) => {
            const reviewWithDate = {
              ...review,
              createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
            };
            return <ReviewCard key={review._id} review={reviewWithDate} />;
          })}
        </div>
      </div>

      {showModal && (
        <ReviewImageModal
          review={reviewsWithImages[selectedReviewIndex]}
          onClose={closeModal}
          onPrev={handlePrev}
          onNext={handleNext}
          currentIndex={selectedReviewIndex}
          totalReviews={reviewsWithImages.length}
        />
      )}
    </>
  );
};

export default ReviewImageCarousel;