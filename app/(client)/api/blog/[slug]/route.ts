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