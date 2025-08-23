"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { PortableTextBlock } from "@portabletext/types";
interface BlogEditFormProps {
    onClose: () => void;
    slug: string;
}
const EditBlogPage = ({ onClose, slug }: BlogEditFormProps) => {
    const router = useRouter();
    const handleClose = () => {
        router.back();
    };
    const [formData, setFormData] = useState({
        _id: "",
        title: "",
        slug: "",
        body: [] as PortableTextBlock[],
        publishedAt: "",
        mainImage: { _type: "image", asset: { url: "" } },
        categories: [] as string[],
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    interface Category {
        title: string;
    }

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                if (!slug) return;

                const res = await fetch(`/api/blog/${slug}`);
                if (!res.ok) throw new Error("Failed to fetch blog");

                const data = await res.json();

                setFormData({
                    _id: data._id || "",
                    title: data.title || "",
                    slug: data.slug.current || "",
                    body: data.body || [],
                    publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().split('T')[0] : "",
                    mainImage: data.mainImage
                        ? { _type: "image", asset: { url: data.mainImage.asset?.url || "" } }
                        : { _type: "image", asset: { url: "" } },
                    categories: data.categories?.map((cat: Category) => cat.title) || [],
                });
                setPreviewImage(data.mainImage?.asset?.url || "");

            } catch (err) {
                console.error(err);
                alert("Failed to load blog");
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            setImageFile(file);
            const fileUrl = URL.createObjectURL(file);
            setPreviewImage(fileUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();
            data.append("id", formData._id);
            data.append("title", formData.title);
            data.append("slug", formData.slug);
            data.append("body", JSON.stringify(formData.body));
            data.append("publishedAt", formData.publishedAt);
            data.append("categories", JSON.stringify(formData.categories));

            if (imageFile) {
                data.append("image", imageFile);
            } else {
                data.append("image", "no-change");
            }

            const res = await fetch("/api/blog/update", { method: "POST", body: data });
            const result = await res.json();

            if (res.ok) {
                alert("Blog updated successfully!");
                onClose();
                router.push(`/blog/${formData.slug}`);
            } else {
                throw new Error(result.error || "Failed to update blog");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unknown error";
            alert(`Update failed: ${message}`);
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 text-center text-gray-700">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-full max-h-[95vh] overflow-y-auto relative flex flex-col scrollbar-hide"
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-semibold text-gray-900">Edit Blog</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Form Design */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6 flex-1">
                    {/* Title */}
                    <div className="flex flex-col">
                        <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter blog title"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
                        />
                    </div>


                    {/* Main Image */}
                    <div className="flex flex-col">
                        <label htmlFor="image" className="text-sm font-medium text-gray-700 mb-2">Main Image</label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-gray-600 file:py-2 file:px-4 file:rounded-full file:bg-shop_dark_green/10 file:text-shop_dark_green hover:file:bg-shop_dark_green/20"
                        />
                        <div className="mt-2 w-48 h-48 relative bg-gray-100 rounded-md border overflow-hidden">
                            {previewImage ? (
                                <Image
                                    src={previewImage}
                                    alt="Image Preview"
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-gray-400 text-sm">Image Preview</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="publishedAt" className="text-sm font-medium text-gray-700 mb-2">Published Date</label>
                        <input
                            id="publishedAt"
                            name="publishedAt"
                            type="date"
                            value={formData.publishedAt}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="body" className="text-sm font-medium text-gray-700 mb-2">Body</label>
                        <textarea
                            id="body"
                            name="body"
                            rows={8}
                            value={formData.body.length > 0 ? formData.body[0].children[0].text : ""}
                            onChange={(e) => {
                                const newBody = [{ _key: "temp", _type: "block", children: [{ _key: "temp", _type: "span", text: e.target.value }], markDefs: [], style: "normal" }];
                                setFormData((prev) => ({ ...prev, body: newBody as PortableTextBlock[] }));
                            }}
                            placeholder="Write blog content..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-shop_dark_green resize-none"
                        />
                    </div>

                    <div className="flex justify-end mt-4 gap-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 px-5 py-2"
                        >
                            Cancel
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-shop_dark_green text-white font-semibold hover:bg-shop_dark_green/90 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={submitting}
                        >
                            {submitting ? "Updating..." : "Update Blog"}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditBlogPage;