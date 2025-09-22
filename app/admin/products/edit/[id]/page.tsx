"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { resetProductState, updateProduct } from "@/app/store/slices/admin/productSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { useParams } from "next/navigation";

const schema = yup.object({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  discountPrice: yup
    .number()
    .typeError("Discount price must be a number")
    .min(0, "Discount price must be positive")
    .nullable()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    ),
  category: yup.string().required("Category is required"),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .min(0, "Stock must be at least 0")
    .required("Stock is required"),
  image: yup
    .mixed<File>()
    .test(
      "fileSize",
      "Image must be less than 2MB",
      (file) => !file || file.size <= 2000000
    ),
  isAvailable: yup.boolean().default(true),
});

type ProductForm = yup.InferType<typeof schema>;

const EditProductForm: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, error } = useSelector(
    (state: RootState) => state.product
  );

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductForm>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discountPrice: null,
      stock: 0,
      image: undefined as unknown as File,
      isAvailable: true,
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/products/${id}`);
        const product = res.data;

        setValue("name", product.name);
        setValue("description", product.description);
        setValue("price", product.price);
        setValue("discountPrice", product.discountPrice);
        setValue("stock", product.stock);
        setValue("category", product.category);
        setValue("isAvailable", product.isAvailable);

        if (product.image) {
          setPreviewImage(`http://localhost:3001${product.image}`);
        }
      } catch (err) {
        console.error("Error fetching product", err);
      }
    };

    if (id) fetchProduct();
  }, [id, setValue]);

  useEffect(() => {
    if (success) {
      toast.success("✅ Product updated successfully!");
      dispatch(resetProductState());
    }
    if (error) {
      toast.error(error);
      dispatch(resetProductState());
    }
  }, [success, error, dispatch]);

  const onSubmit: SubmitHandler<ProductForm> = async (data) => {
    if (submitted) {
      toast.error("⚠️ Product update in progress. Please wait...");
      return;
    }

    try {
      await schema.validate(data, { abortEarly: false });
      setSubmitted(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("discountPrice", data.discountPrice?.toString() || "0");
      formData.append("stock", data.stock.toString());
      formData.append("category", data.category);
      formData.append("isAvailable", String(data.isAvailable));

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      dispatch(updateProduct({ id: Number(id), formData }));
      setSubmitted(false);
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((yupError) => {
          if (yupError.path) {
            setError(yupError.path as keyof ProductForm, {
              type: "manual",
              message: yupError.message,
            });
          }
        });
      } else {
        toast.error("Unexpected error occurred");
      }
      setSubmitted(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-card shadow-lg rounded-xl border border-border">
      <h2 className="text-2xl font-bold mb-6 text-center text-shop_dark_green">
        Update Product
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-shop_light_text mb-1">
            Product Name
          </label>
          <input
            type="text"
            {...register("name")}
            className={`w-full p-3 border rounded-lg ${errors.name ? "border-red-500" : ""
              }`}
            placeholder="Enter product name"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-shop_light_text mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            className={`w-full p-3 border rounded-lg ${errors.description ? "border-red-500" : ""
              }`}
            placeholder="Enter description"
            rows={4}
          />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              {...register("price")}
              className={`w-full p-3 border rounded-lg ${errors.price ? "border-red-500" : ""}`}
            />
            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Discount Price</label>
            <input
              type="number"
              {...register("discountPrice")}
              className={`w-full p-3 border rounded-lg ${errors.discountPrice ? "border-red-500" : ""}`}
            />
            {errors.discountPrice && <p className="text-red-500">{errors.discountPrice.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input
            type="number"
            {...register("stock")}
            className={`w-full p-3 border rounded-lg ${errors.stock ? "border-red-500" : ""}`}
          />
          {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            {...register("category")}
            className={`w-full p-3 border rounded-lg ${errors.category ? "border-red-500" : ""}`}
          >
            <option value="">Select</option>
            <option value="Gadget">Gadget</option>
            <option value="Appliances">Appliances</option>
            <option value="Refrigerators">Refrigerators</option>
            <option value="Others">Others</option>
          </select>
          {errors.category && <p className="text-red-500">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Upload Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setValue("image", file, { shouldValidate: true });
                setPreviewImage(URL.createObjectURL(file));
              }
            }}
          />
          {errors.image && <p className="text-red-500">{errors.image.message}</p>}
          {previewImage && (
            <Image
              src={previewImage}
              alt="Preview"
              width={160}
              height={160}
              className="rounded-lg border mt-2"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("isAvailable")} />
          <label>Available for Sale</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-shop_btn_dark_green text-white py-3 rounded-lg"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductForm;
