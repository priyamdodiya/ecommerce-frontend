"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { getProducts, Product } from "@/app/store/slices/user/productSlice";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct } from "@/app/store/slices/admin/productSlice";

const ProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.userProduct
  );
  const BASE_URL = "http://localhost:3001";

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
  if (confirm("Are you sure you want to delete this product?")) {
    const resultAction = await dispatch(deleteProduct(id));

    if (deleteProduct.fulfilled.match(resultAction)) {
      dispatch(getProducts());
    }
  }
};


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-shop_dark_green tracking-tight">
          Products
        </h1>
        <Link href="/admin/products/add">
          <button className="bg-shop_dark_green text-white px-5 py-2 rounded-lg font-medium shadow hover:bg-shop_btn_dark_green">
            + Create Product
          </button>
        </Link>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg border border-gray-200">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-shop_light_pink text-shop_dark_green text-sm uppercase tracking-wide">
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product: Product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    {product.image && (
                      <Image
                        src={`${BASE_URL}${product.image}`}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="w-16 h-16 object-contain rounded-md border"
                      />
                    )}
                  </td>
                  <td className="p-4 font-semibold text-gray-800">
                    {product.name}
                  </td>
                  <td className="p-4 text-gray-600 whitespace-normal break-words max-w-sm">
                    {product.description}
                  </td>
                  <td className="p-4 font-medium text-gray-800">
                    ₹{product.discountPrice || product.price}
                  </td>
                  <td
                    className={`p-4 font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {product.stock > 0 ? product.stock : "Unavailable"}
                  </td>
                  <td className="p-4 text-gray-700">{product.category}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <button className="px-3 py-1.5 rounded-md bg-shop_dark_green text-white text-sm font-medium hover:bg-shop_btn_dark_green shadow">
                          Edit
                        </button>
                      </Link>
                      <button type="button" onClick={() => handleDelete(product.id)} className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 shadow">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-500">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProductsPage;