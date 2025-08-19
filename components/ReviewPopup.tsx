"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { XCircle, Camera } from "lucide-react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useState, useRef } from "react";
import { urlFor } from "@/sanity/lib/image";
import { SanityImageCrop, SanityImageHotspot } from "@/sanity.types";

interface SanityImage {
  _type: "image";
  _key: string;
  asset?: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
}

interface ReviewPopupProps {
  activeImage?: SanityImage;
  productId: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  averageRating: number;
  totalReviews: number;
  ratingCounts: number[];
}

const ReviewPopup = ({
  activeImage,
  productId,
  userId,
  isOpen,
  onClose,
  averageRating,
  totalReviews,
}: ReviewPopupProps) => {
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null); // ✅ form ref

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReviewImage(e.target.files[0]);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (rating === 0) {
      alert("Please select a star rating.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("rating", String(rating));
    formData.append(
      "reviewText",
      (formRef.current?.elements.namedItem("reviewText") as HTMLTextAreaElement)
        .value
    );
    formData.append(
      "reviewTitle",
      (formRef.current?.elements.namedItem("reviewTitle") as HTMLInputElement)
        .value
    );
    formData.append(
      "publicName",
      (formRef.current?.elements.namedItem("publicName") as HTMLInputElement)
        .value
    );
    formData.append("productId", productId);
    formData.append("userId", userId);
    if (reviewImage) {
      formData.append("reviewImage", reviewImage);
    }

    try {
      const response = await fetch("/api/create-review", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("✌️data --->", data);

      if (response.ok) {
        console.log("Review submitted successfully!", data);
        onClose();
        setRating(0);
        setReviewImage(null);
        formRef.current?.reset(); // ✅ safe reset
      } else {
        console.error("Failed to submit review:", data.message);
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred. Please check the console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <XCircle size={28} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              {activeImage && (
                <Image
                  src={urlFor(activeImage).url()}
                  alt="Product"
                  width={80}
                  height={80}
                  className="object-contain rounded-md border border-gray-200 p-1"
                />
              )}
              <h2 className="text-xl font-bold text-darkColor">
                How was the item?
              </h2>
            </div>
            {totalReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-gray-800">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <span key={index}>
                      {index < Math.round(averageRating) ? (
                        <FaStar size={20} className="text-yellow-400" />
                      ) : (
                        <FaRegStar size={20} className="text-gray-300" />
                      )}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  ({totalReviews} reviews)
                </p>
              </div>
            )}

            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => handleStarClick(index)}
                  className="cursor-pointer text-2xl"
                >
                  {index < rating ? (
                    <FaStar className="text-yellow-400" />
                  ) : (
                    <FaRegStar className="text-gray-400" />
                  )}
                </span>
              ))}
            </div>

            <form
              ref={formRef}
              onSubmit={handleReviewSubmit}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="reviewText"
                  className="block text-gray-700 font-semibold mb-1"
                >
                  Write a review
                </label>
                <textarea
                  id="reviewText"
                  name="reviewText"
                  rows={4}
                  placeholder="What should other customers know?"
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Share a video or photo
                </label>
                <div
                  className="border border-gray-300 border-dashed rounded-md p-6 flex items-center justify-center cursor-pointer hover:border-shop_dark_green transition-colors relative"
                  onClick={() =>
                    document.getElementById("reviewImageInput")?.click()
                  }
                >
                  <input
                    id="reviewImageInput"
                    type="file"
                    name="reviewImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {reviewImage ? (
                    <Image
                      src={URL.createObjectURL(reviewImage)}
                      alt="Review Preview"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Camera size={30} className="text-gray-400" />
                      <span className="text-gray-500 text-sm mt-2">
                        Click to upload image
                      </span>
                    </div>
                  )}
                  {reviewImage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReviewImage(null);
                      }}
                      className="absolute top-1 right-1 text-gray-500 hover:text-red-500"
                    >
                      <XCircle size={20} />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="reviewTitle"
                  className="block text-gray-700 font-semibold mb-1"
                >
                  Title your review (required)
                </label>
                <input
                  type="text"
                  id="reviewTitle"
                  name="reviewTitle"
                  placeholder="What's most important to know?"
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="publicName"
                  className="block text-gray-700 font-semibold mb-1"
                >
                  Whats your public name? (required)
                </label>
                <input
                  type="text"
                  id="publicName"
                  name="publicName"
                  placeholder="enter your name"
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
                  required
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-shop_dark_green/80 hover:bg-shop_dark_green text-white font-bold rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewPopup;
