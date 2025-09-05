"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { resetProductState } from "@/app/store/slices/productSlice";
import axios from "axios";
import { NextApiResponse } from "next";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  image: File | null;
  isAvailable: boolean;
}

const CreateProductForm: React.FC = () => {
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    image: null,
    isAvailable: true,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, error } = useSelector((state: RootState) => state.product)

  useEffect(() => {
    if (success) {
      alert("✅ Product created successfully!");
      dispatch(resetProductState());
      setFormData({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        stock: "",
        image: null,
        isAvailable: true,
      });
      setPreviewImage(null);
    }
    if (error) {
      alert(error);
      dispatch(resetProductState());
    }
  }, [success, error, dispatch])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, type } = target;

    if (type === "file") {
      const input = target as HTMLInputElement;
      const file = input.files ? input.files[0] : null;
      console.log({ file })
      setFormData({ ...formData, [name]: file });
      if (file) {
        setPreviewImage(URL.createObjectURL(file));
      } else {
        setPreviewImage(null);
      }
    } else if (type === "checkbox") {
      const input = target as HTMLInputElement;
      setFormData({ ...formData, [name]: input.checked });
    } else {
      setFormData({ ...formData, [name]: target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("discountPrice", formData.discountPrice);
      data.append("stock", formData.stock);
      if (formData.image) {
        console.log("formData", formData)
        data.append("image", formData.image);
      }
      const response = await axios.post<NextApiResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log({ response })
    } catch (error) {
      console.log({ error })
    }

  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-card shadow-lg rounded-xl border border-border">
      <h2 className="text-2xl font-bold mb-6 text-center text-shop_dark_green">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-shop_light_text mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-shop_light_green focus:border-shop_light_green"
            placeholder="Enter product name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-shop_light_text mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-shop_light_green focus:border-shop_light_green"
            placeholder="Enter product description"
            rows={4}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-shop_light_text mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-shop_light_green focus:border-shop_light_green"
              placeholder="₹ Price"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-shop_light_text mb-1">
              Discount Price
            </label>
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-shop_light_green focus:border-shop_light_green"
              placeholder="₹ Discount Price"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-shop_light_text mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-shop_light_green focus:border-shop_light_green"
            placeholder="Enter stock quantity"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-shop_light_text mb-2">
            Upload Product Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-shop_light_green file:text-white
              hover:file:bg-shop_lighter_green"
          />
          {previewImage && (
            <Image
              src={previewImage}
              alt="Preview"
              width={160}
              height={160}
              className="object-cover rounded-lg border"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            className="h-4 w-4 text-shop_light_green focus:ring-shop_light_green border-gray-300 rounded"
          />
          <label className="text-sm text-shop_light_text">
            Available for Sale
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-shop_btn_dark_green text-white py-3 rounded-lg font-medium hover:bg-shop_light_green transition-all duration-300 hoverEffect"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProductForm;