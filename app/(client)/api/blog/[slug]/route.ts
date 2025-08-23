import { NextRequest, NextResponse } from "next/server";
import { getSingleBlog } from "@/sanity/queries";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const blog = await getSingleBlog(params.slug);
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}



// import { auth } from "@clerk/nextjs/server";
// import { deleteBlog } from "@/sanity/queriess";

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await deleteBlog(params.slug);

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to delete blog" },
//       { status: 500 }
//     );
//   }
// }

