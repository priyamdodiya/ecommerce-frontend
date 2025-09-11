"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store/store";
import { logout } from "../app/store/slices/loginSlice";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
const SignIn = () => {
  const { user } = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
     router.push("/login");
    Cookies.remove("token");
    setMenuOpen(false);
   
  Cookies.remove("role");
  };

  if (user) {
    return (
      <div className="relative" ref={menuRef}>
        <Image
          src={user?.profilePhoto || "/default-avatar.png"}
          alt={user?.username || "user"}
          width={36}
          height={36}
          className="rounded-full border border-gray-300 cursor-pointer hover:opacity-80"
          onClick={() => setMenuOpen((prev) => !prev)}
        />

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-sm shadow-lg py-2 z-50">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href="/login">
      <button className="text-sm text-lightColor hover:cursor-pointer font-semibold hover:text-darkColor hoverEffect">
        Login
      </button>
    </Link>
  );
};

export default SignIn;
