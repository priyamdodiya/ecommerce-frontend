"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
export default function AdminPage() {
  const { user } = useSelector((state: RootState) => state.login);

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <h1 className="text-3xl font-bold text-green-600">
        Hello Admin, {user?.fullName} 👋
      </h1>
    </div>
  );
}
