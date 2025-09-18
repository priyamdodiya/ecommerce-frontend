"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { resetProductState } from "@/app/store/slices/admin/productSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
    category : yup.string().required("Category is required"),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .min(0, "Stock must be at least 1")
    .required("Stock is required"),
  image: yup
    .mixed<File>()
    .required("Image is required")
    .test("fileSize", "Image must be less than 2MB", (file) =>
      file ? file.size <= 2000000 : false
    ),
  isAvailable: yup.boolean().default(true),
});

type ProductForm = yup.InferType<typeof schema>;

const CreateProductForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, error } = useSelector(
    (state: RootState) => state.product
  );

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: yupResolver(schema),
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
    if (success) {
      toast.success("✅ Product created successfully!");
      dispatch(resetProductState());
      setSubmitted(false);
      reset();
      setPreviewImage(null);
    }
    if (error) {
      toast.error(error);
      setSubmitted(false);
      dispatch(resetProductState());
    }
  }, [success, error, dispatch, reset]);

  const onSubmit: SubmitHandler<ProductForm> = async (data) => {
    if (submitted) {
      toast.error("⚠️ Product already being added. Please wait...");
      return;
    }

    try {
      setSubmitted(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("discountPrice", data.discountPrice?.toString() || "0");
      formData.append("stock", data.stock.toString());
      formData.append("category",data.category);
      formData.append("isAvailable", String(data.isAvailable));
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("✅ Product created successfully!");
      console.log("response", response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Unexpected error occurred");
      }
      setSubmitted(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-card shadow-lg rounded-xl border border-border">
      <h2 className="text-2xl font-bold mb-6 text-center text-shop_dark_green">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-shop_light_text mb-1">
            Product Name
          </label>
          <input
            type="text"
            {...register("name")}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-shop_light_green focus:border-shop_light_green ${errors.name ? "border-red-500" : ""
              }`}
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-shop_light_text mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-shop_light_green focus:border-shop_light_green ${errors.description ? "border-red-500" : ""
              }`}
            placeholder="Enter product description"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-shop_light_text mb-1">
              Price
            </label>
            <input
              type="number"
              {...register("price")}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-shop_light_green focus:border-shop_light_green ${errors.price ? "border-red-500" : ""
                }`}
              placeholder="₹ Price"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-shop_light_text mb-1">
              Discount Price
            </label>
            <input
              type="number"
              {...register("discountPrice")}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-shop_light_green focus:border-shop_light_green ${errors.discountPrice ? "border-red-500" : ""
                }`}
              placeholder="₹ Discount Price"
            />
            {errors.discountPrice && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discountPrice.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-shop_light_text mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            {...register("stock")}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-shop_light_green focus:border-shop_light_green ${errors.stock ? "border-red-500" : ""
              }`}
            placeholder="Enter stock quantity"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-shop_light_text mb-1">Category</label>
          <select {...register("category")} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-shop_light_green focus:border-shop_light_green ${errors.category ? "border-red-500" : ""}`}>
            <option value="">Select a category</option>
            <option value="Gadget">Gadget</option>
            <option value="Appliances">Appliances</option>
            <option value="Refrigerators">Refrigerators</option>
            <option value="Others">Others</option>
          </select>
          {errors.category && (<p className="text-red-500 text-sm mt-1">{errors.category.message}</p>)}
        </div>

        <div>
          <label className="block text-sm font-medium text-shop_light_text mb-2">
            Upload Product Image
          </label>
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
            className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-shop_light_green file:text-white
              hover:file:bg-shop_lighter_green ${errors.image ? "border-red-500" : ""
              }`}
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}
          {previewImage && (
            <Image
              src={previewImage}
              alt="Preview"
              width={160}
              height={160}
              className="object-cover rounded-lg border mt-2"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("isAvailable")}
            className="h-4 w-4 text-shop_light_green focus:ring-shop_light_green border-gray-300 rounded"
          />
          <label className="text-sm text-shop_light_text">
            Available for Sale
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-shop_btn_dark_green text-white py-3 rounded-lg font-medium hover:bg-shop_light_green transition-all duration-300 hoverEffect"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProductForm;
