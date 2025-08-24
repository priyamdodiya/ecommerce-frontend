"use client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export const DeleteBlogButton = ({ slug }: { slug: string }) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (!slug) return; 

    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/blog");
        router.refresh();
      } else {
        console.error("Failed to delete blog");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Trash2
      size={22}
      className="hover:text-red-500 cursor-pointer"
      onClick={handleDelete}
    />
  );
};

