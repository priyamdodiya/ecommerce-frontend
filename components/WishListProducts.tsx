"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { fetchWishlist, removeFromWishlist } from "@/app/store/slices/user/wishlistSlice";
import Container from "./Container";
import { Heart, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";
const WishListProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const API_BASE_URL = "http://localhost:3001";
  const [visibleProducts, setVisibleProducts] = useState(7);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);
  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, wishlist.length));
  };
 const handleRemove = async (id: number) => {
  try {
    await dispatch(removeFromWishlist(id)).unwrap();
    dispatch(fetchWishlist());
    toast.success("Product removed from wishlist");
  } catch (err) {
    console.error("Wishlist remove error:", err);
    toast.error("Failed to remove product");
  }
};

  return (
    <Container>
      {wishlist.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b">
                <tr className="bg-black/5">
                  <th className="p-2 text-left">Image</th>
                  <th className="p-2 text-left hidden md:table-cell">Category</th>
                  <th className="p-2 text-left hidden md:table-cell">Status</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-center md:text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.slice(0, visibleProducts).map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="px-2 py-4 flex items-center gap-2">
                      <X
                        onClick={() => handleRemove(product.id)}
                        size={18}
                        className="hover:text-red-600 hover:cursor-pointer hoverEffect"
                      />
                      {product.image && (
                        <Link
                          href={`/product/${product.id}`}
                          className="border rounded-md group hidden md:inline-flex"
                        >
                          <Image
                            src={`${API_BASE_URL}${product.image}`}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="rounded-md group-hover:scale-105 hoverEffect h-20 w-20 object-contain"
                          />
                        </Link>
                      )}
                      <p className="line-clamp-1">{product.name}</p>
                    </td>
                    <td className="p-2 capitalize hidden md:table-cell">
                      {product.category && (
                        <p className="uppercase line-clamp-1 text-xs font-medium">
                          {product.category}
                        </p>
                      )}
                    </td>
                    <td
                      className={`p-2 w-24 ${
                        product.isAvailable ? "text-green-600" : "text-red-600"
                      } font-medium text-sm hidden md:table-cell`}
                    >
                      {product.isAvailable ? "In Stock" : "Out of Stock"}
                    </td>
                    <td className="p-2">
                      <PriceFormatter amount={product.discountPrice || product.price} />
                    </td>
                    <td className="p-2">
                      <AddToCartButton product={{
    id: product.id,
    name: product.name,
    price: product.price,
    discount: product.discount || 0,
    stock: product.stock || 0, // provide default
    description: product.description || "", // provide default
    category: product.category || "",
    image: product.image || "",
    isAvailable: product.isAvailable || true,
  }}
 className="w-full" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-2">
            {visibleProducts < wishlist.length && (
              <div className="my-5">
                <Button variant="outline" onClick={loadMore}>
                  Load More
                </Button>
              </div>
            )}
            {visibleProducts > 10 && (
              <div className="my-5">
                <Button onClick={() => setVisibleProducts(10)} variant="outline">
                  Load Less
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-muted-foreground/20" />
            <Heart className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-muted-foreground">
              Items added to your wishlist will appear here
            </p>
          </div>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};
export default WishListProducts;