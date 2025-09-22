"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { updateProfilePhoto, removeProfilePhoto } from "@/app/store/slices/user/profilePhotoSlice";
import Animation from "../../../../image/animation.gif";
import Panimation from "../../../../image/panimation.gif";
const UpdatePhoto1 = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { loading } = useSelector((state: RootState) => state.login);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!file) return;

    dispatch(updateProfilePhoto(file));

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    dispatch(removeProfilePhoto());
    setPreview(null);
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex justify-center items-center mt-20 mb-47 p-4">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-lg overflow-hidden max-w-4xl w-full">
        <div className="w-full md:w-1/2 flex justify-center items-center p-6 bg-white">
          <Image
            src={Animation}
            alt="Illustration"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 space-y-6">
          <Image
            src={preview || Panimation}
            alt="Upload Preview"
            width={128}
            height={128}
            className="w-32 h-32 object-cover rounded-full border"
          />
          <div className="w-full space-y-4">
            <label className="block text-lg font-bold text-gray-900">
              Upload Photo
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              disabled={!file || loading}
            >
              {loading ? "Updating..." : "Update Photo"}
            </button>
            <button
              onClick={handleRemove}
              className="w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Removing..." : "Remove Photo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdatePhoto1;