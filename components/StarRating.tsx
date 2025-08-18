    "use client";
    import React from "react";
    import { Rating } from "react-simple-star-rating";
    import { useRating } from "@/context/RatingContext";

    export default function StarRating({ productId }: { productId: string }) {
    const { ratings, setRating } = useRating();
    const currentRating = ratings[productId] || 0;

    const handleRating = (rate: number) => {
        setRating(productId, rate);
    };

    return (
        <div className="flex items-center gap-2">
        <Rating
            onClick={handleRating}
            initialValue={currentRating}
            size={16}
            fillColor="#3b9c3c"
            emptyColor="gray"
            allowHover={true}
            SVGclassName="inline-block"
        />
        <span className="ml-2 text-sm font-semibold">{currentRating} / 5</span>
        </div>
    );
    }
