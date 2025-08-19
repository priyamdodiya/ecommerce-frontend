// sanity/queries/productQueries.ts
import { groq } from "next-sanity";

export const productsWithReviewStatsQuery = groq`
  *[_type == "product" && variant == $variant] | order(name desc) {
    ...,
    "categories": categories[]->title,
    "reviewStats": *[_type == "review" && product._ref == ^._id] {
      rating
    }
  }
`;


export const allProductsWithReviewStatsQuery = groq`
  *[_type == "product"] {
    ...,
    "reviewStats": *[_type == "review" && product._ref == ^._id] {
      rating
    }
  }
`;


export const hotDealProductsWithReviewStatsQuery = groq`
  *[_type == "product" && isHotDeal == true] | order(name desc) {
    ...,
    "categories": categories[]->title,
    "reviewStats": *[_type == "review" && product._ref == ^._id] {
      rating
    }
  }
`;