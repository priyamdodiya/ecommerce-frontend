// import createImageUrlBuilder from '@sanity/image-url';
// import { SanityImageSource } from "@sanity/image-url/lib/types/types";
// import { PortableTextBlock } from "@portabletext/types";
// import { client } from "./lib/client";

// const builder = createImageUrlBuilder({ 
//   projectId: client.config().projectId!, 
//   dataset: client.config().dataset! 
// });

// export const urlFor = (
//   source: { _type: "image"; asset: { _ref: string } } | SanityImageSource | null | undefined
// ): string | null => {
//   if (!source) return null;
//   return builder.image(source as SanityImageSource).url();
// };

// export interface UpdateBlogParams {
//   id: string;
//   title: string;
//   body: PortableTextBlock[];
//   imageFile?: File;
// }

// export interface Blog {
//   _id: string;
//   title: string;
//   body: PortableTextBlock[];
//   mainImage?: {
//     _type: "image";
//     asset: { _ref: string };
//   };
// }

// export async function updateBlog({ id, title, body, imageFile }: UpdateBlogParams): Promise<Blog> {
//   const patch: Partial<Blog> = { title, body };

//   if (imageFile) {
//     const imageData = await client.assets.upload("image", imageFile, { filename: imageFile.name });
//     patch.mainImage = { _type: "image", asset: { _ref: imageData._id } };
//   }

//   const updated = await client.patch(id).set(patch).commit();

//   return updated as unknown as Blog;
// }



// export const getSingleBlog = async (slug: string) => {
//   try {
//     const blog = await client.fetch(
//       `*[_type == "blog" && slug.current == $slug][0]{
//         _id,
//         title,
//         "slug": slug.current,
//         body,
//         author->{
//           _id,
//           name
//         }
//       }`,
//       { slug }
//     );
//     return blog || null;
//   } catch (error) {
//     console.error("Error fetching blog:", error);
//     return null;
//   }
// };




import createImageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { PortableTextBlock } from "@portabletext/types";
import { client } from "./lib/client";

const builder = createImageUrlBuilder({
  projectId: client.config().projectId!,
  dataset: client.config().dataset!
});

export const urlFor = (
  source: { _type: "image"; asset: { _ref: string } } | SanityImageSource | null | undefined
): string | null => {
  if (!source) return null;
  return builder.image(source as SanityImageSource).url();
};

export interface UpdateBlogParams {
  id: string;
  title: string;
  body: PortableTextBlock[];
  publishedAt?: string;
  imageFile?: File;
}

export interface Blog {
  _id: string;
  title: string;
  body: PortableTextBlock[];
  publishedAt?: string;
  mainImage?: {
    _type: "image";
    asset: { _ref: string };
  };
}

export async function updateBlog({ id, title, body, publishedAt, imageFile }: UpdateBlogParams): Promise<Blog> {
  const patch: Partial<Blog> = { title, body };

  if (publishedAt) {
    patch.publishedAt = publishedAt;
  }

  if (imageFile) {
    const imageData = await client.assets.upload("image", imageFile, { filename: imageFile.name });
    patch.mainImage = { _type: "image", asset: { _ref: imageData._id } };
  }

  const updated = await client.patch(id).set(patch).commit();
  return updated as unknown as Blog;
}

export const getSingleBlog = async (slug: string) => {
  try {
    const blog = await client.fetch(
      `*[_type == "blog" && slug.current == $slug][0]{
        _id,
        title,
        "slug": slug.current,
        body,
        publishedAt,
        author->{
          _id,
          name
        },
        mainImage{
          asset->{_ref}
        }
      }`,
      { slug }
    );
    return blog || null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
};
