"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type RatingContextType = {
  ratings: Record<string, number>;
  setRating: (productId: string, rating: number) => void;
};

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export const RatingProvider = ({ children }: { children: ReactNode }) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const setRating = (productId: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: rating,
    }));
  };

  return (
    <RatingContext.Provider value={{ ratings, setRating }}>
      {children}
    </RatingContext.Provider>
  );
};

export const useRating = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error("useRating must be used inside RatingProvider");
  }
  return context;
};
