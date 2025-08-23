import createImageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { PortableTextBlock } from "@portabletext/types";
import { client } from "./lib/client";

// Initialize the Sanity image builder


// Initialize the Sanity image builder safely
const builder = createImageUrlBuilder({ 
  projectId: client.config().projectId!, 
  dataset: client.config().dataset! 
});

// Safe urlFor function
export const urlFor = (
  source: { _type: "image"; asset: { _ref: string } } | SanityImageSource | null | undefined
): string | null => {
  if (!source) return null;
  return builder.image(source as SanityImageSource).url(); // <--- call .url() here
};

// Types
export interface UpdateBlogParams {
  id: string;
  title: string;
  body: PortableTextBlock[];
  imageFile?: File;
}

export interface Blog {
  _id: string;
  title: string;
  body: PortableTextBlock[];
  mainImage?: {
    _type: "image";
    asset: { _ref: string };
  };
}

// Function to update a blog with strict types
export async function updateBlog({ id, title, body, imageFile }: UpdateBlogParams): Promise<Blog> {
  const patch: Partial<Blog> = { title, body };

  if (imageFile) {
    const imageData = await client.assets.upload("image", imageFile, { filename: imageFile.name });
    patch.mainImage = { _type: "image", asset: { _ref: imageData._id } };
  }

  const updated = await client.patch(id).set(patch).commit();

  // Assert as unknown first to satisfy TypeScript
  return updated as unknown as Blog;
}

// Function to get a single blog
export async function getSingleBlog(slug: string): Promise<Blog | null> {
  const query = `*[_type == "blog" && slug.current == $slug][0]{
    _id,
    title,
    body,
    mainImage
  }`;
  const blog = await client.fetch<Blog | null>(query, { slug });
  return blog;
}
