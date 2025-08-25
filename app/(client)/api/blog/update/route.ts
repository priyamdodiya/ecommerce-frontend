// import { updateBlog } from "@/sanity/queriess";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const id = formData.get("id") as string;
//     const title = formData.get("title") as string;
//     const body = JSON.parse(formData.get("body") as string);
//     const imageFile = formData.get("image") as File | null;

//     await updateBlog({ id, title, body, imageFile: imageFile ?? undefined });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
//   }
// }




import { updateBlog } from "@/sanity/queriess";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const body = JSON.parse(formData.get("body") as string);
    const publishedAt = formData.get("publishedAt") as string;
    const imageFile = formData.get("image") as File | null;

    await updateBlog({ id, title, body, publishedAt, imageFile: imageFile ?? undefined });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

