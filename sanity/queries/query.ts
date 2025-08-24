import { defineQuery } from "next-sanity";
import { groq } from "next-sanity";
const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(name asc) `);

const LATEST_BLOG_QUERY = defineQuery(
  ` *[_type == 'blog' && isLatest == true]|order(name asc){
      ...,
      blogcategories[]->{
      title
    }
    }`
);

const DEAL_PRODUCTS = defineQuery(`
  *[_type == 'product' && status == 'hot'] | order(name asc) {
    _id,
    name,
    slug,
    price,
    discount,
    stock,
    status,
    images,
    brand->{_id, title},
    "categories": categories[]->title, // <-- This is where the issue is.
    "reviewStats": *[_type == "review" && product._ref == ^._id] {
      rating
    }
  }
`);


const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug] | order(name asc) [0]`
);

const BRAND_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug]{
  "brandName": brand->title
  }`);

const MY_ORDERS_QUERY =
  defineQuery(`*[_type == 'order' && clerkUserId == $userId] | order(orderData desc){
...,products[]{
  ...,product->
}
}`);
const GET_ALL_BLOG = defineQuery(
  `*[_type == 'blog'] | order(publishedAt desc)[0...$quantity]{
  ...,
      blogcategories[]->{
    title
}
    }
  `
);


const SINGLE_BLOG_QUERY = groq`
  *[_type == "blog" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    body,
    author->{
      name,
      image,
      "slug": slug.current,
      clerkUserId
    },
    blogcategories[]->{title, slug}
  }
`;


const BLOG_CATEGORIES = defineQuery(
  `*[_type == "blog"]{
      blogcategories[]->{
    ...
    }
  }`
);

const OTHERS_BLOG_QUERY = defineQuery(`*[
  _type == "blog"
  && defined(slug.current)
  && slug.current != $slug
]|order(publishedAt desc)[0...$quantity]{
...
  publishedAt,
  title,
  mainImage,
  slug,
  author->{
    name,
    image,
  },
  categories[]->{
    title,
    "slug": slug.current,
  }
}`);

export {
  BRANDS_QUERY,
  LATEST_BLOG_QUERY,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_QUERY,
  MY_ORDERS_QUERY,
  GET_ALL_BLOG,
  SINGLE_BLOG_QUERY,
  BLOG_CATEGORIES,
  OTHERS_BLOG_QUERY,
};