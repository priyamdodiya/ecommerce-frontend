"use client";
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
      <div className="w-16 h-16 border-4 border-t-shop_dark_green border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
