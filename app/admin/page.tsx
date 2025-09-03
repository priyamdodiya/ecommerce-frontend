"use client";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";
const AdminPage = () => {
  const { user } = useSelector((state: RootState) => state.login);

  if (!user) {
    return <p className="text-red-500">Please login first!</p>;
  }

  if (user.role !== "ADMIN") {
    return <p className="text-red-500">Access Denied! You are not an admin.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-green-600">
        Hello Admin, {user.fullName} 👋
      </h1>
    </div>
  );
};

export default AdminPage;