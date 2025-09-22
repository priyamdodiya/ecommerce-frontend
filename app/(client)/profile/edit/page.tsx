"use client";
import Image from "next/image";
import React, { useState } from "react";
import Updatep from "../../../../image/updateP.gif";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { updateProfile } from "@/app/store/slices/user/profileSlice";
import toast from "react-hot-toast";
function UpdateProfile1() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.login);
  const { loading, error } = useSelector((state: RootState) => state.profile);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    username: user?.username || "",
    gender: user?.gender || "male",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    toast.success("updated successfully..!")
    dispatch(updateProfile(formData));
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      username: user?.username || "",
      gender: user?.gender || "male",
    });
  };

  return (
    <div className="flex justify-center items-center m-30 bg-white">
      <div className="flex flex-col md:flex-row bg-white shadow-xl overflow-hidden max-w-5xl w-full">
        <div className="flex justify-center items-center bg-white p-6 md:w-1/2">
          <Image
            src={Updatep}
            height={400}
            width={400}
            alt="update profile"
            className="w-80 h-80 object-contain"
          />
        </div>

        <div className="flex flex-col justify-center p-10 md:w-1/2">
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Full Name
          </label>
          <input
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />

          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Email
          </label>
          <input
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <label className="block text-sm font-semibold text-gray-800 mb-1">
            User name
          </label>
          <input
            className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Gender
          </label>
          <div className="flex items-center gap-6 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
              />
              Male
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
              />
              Female
            </label>
          </div>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
          <button
            onClick={handleCancel}
            className="w-full mt-3 bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600 transition"
          >
            Cancel
          </button>

          {error && (
            <p className="mt-3 text-red-600 font-medium text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default UpdateProfile1;