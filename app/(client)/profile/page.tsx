
"use client";
import Image from "next/image";
import React from "react";
import Bprofile from "../../../image/bprofile.jpg";
import Update from "../../../image/update1.gif";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

const Profile1: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.login);
  const BASE_URL = "http://localhost:3001";

  const getPhotoUrl = (photo: string | null | undefined) => {
    if (!photo) return "/default-avatar.png";
    if (photo.startsWith("http")) return photo;
    return `${BASE_URL}${photo}`;
  };

  if (!user) return null;

  return (
    <div className="flex justify-center py-10">
      <div className="w-[600px] bg-white shadow-lg overflow-hidden relative">
        <div className="relative h-56 w-full">
          <Image src={Bprofile} alt="Cover" fill className="object-cover" />
        </div>

        <Link href="/profile/updatephoto">
          <Image
            src={getPhotoUrl(user.profilePhoto)}
            alt={user.fullName || "User Avatar"}
            width={144}
            height={144}
            className="absolute left-1/2 top-40 transform -translate-x-1/2 w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover bg-gray-100 transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </Link>

        <div className="flex flex-col items-center mt-24">
          <h3 className="mt-2 text-xl font-semibold">{user.fullName}</h3>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <div className="flex justify-center mt-6 border-t border-gray-200">
          <Link href="/profile/edit">
            <button className="py-4 flex justify-center flex-col items-center">
              <Image src={Update} alt="Edit" width={32} height={32} />
              <span className="text-base font-medium">Update Profile</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Profile1;
