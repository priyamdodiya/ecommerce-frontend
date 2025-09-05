"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import NewHeader from "./navbar/NewHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSelector((state: RootState) => state.login);

  if (!user) {
    return (
      <p className="text-red-500 text-center mt-10">
        Please login first!
      </p>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <p className="text-red-500 text-center mt-10">
        Access Denied ❌ Admins only.
      </p>
    );
  }

  return (
    <html lang="en">
      <body className="font-poppins antialiased bg-gray-100 min-h-screen ">
        <NewHeader />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
