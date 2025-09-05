"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, type } = target;

    if (type === "file") {
      const input = target as HTMLInputElement;
      setFormData({ ...formData, [name]: input.files ? input.files[0] : null });
    } else if (type === "checkbox") {
      const input = target as HTMLInputElement;
      setFormData({ ...formData, [name]: input.checked });
    } else {
      setFormData({ ...formData, [name]: target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("discountPrice", formData.discountPrice);
      data.append("stock", formData.stock);
      data.append("isAvailable", formData.isAvailable ? "true" : "false");
      if (formData.image) {
        data.append("image", formData.image);
      }

      await axios.post("http://localhost:3001/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product created successfully!");

      setFormData({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        stock: "",
        image: null,
        isAvailable: true,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="discountPrice"
          placeholder="Discount Price"
          value={formData.discountPrice}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
          />
          <label>Available</label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProductForm;
