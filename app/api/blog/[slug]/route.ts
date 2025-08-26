import { getSingleBlog } from "@/sanity/queries";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;
    
    const blog = await getSingleBlog(slug);
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(blog);
  } catch (err) {
    console.error("Error fetching blog:", err);
    return NextResponse.json(
      { error: "Failed to fetch blog" }, 
      { status: 500 }
    );
  }
}