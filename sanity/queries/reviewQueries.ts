
import { groq } from 'next-sanity';

export const reviewsForProductQuery = groq`
  *[_type == "review" && product._ref == $productId] {
    _id,
    reviewer,
    rating,
    reviewText,
    reviewImage,
    createdAt
  }
`;

export const reviewStatsQuery = groq`
  *[_type == "review" && product._ref == $productId] {
    rating
  }
`;



export const productWithReviewStatsQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ...,
    categories[]->{
      _id,
      title,
    },
    brand->{
      _id,
      title
    },
    "reviewStats": *[_type == "review" && product._ref == ^._id] {
      rating
    }
  }
`;
