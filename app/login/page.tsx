"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { loginUser, clearLoginError } from "../store/slices/loginSlice";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type FormValues = {
  username: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user, token } = useSelector((state: RootState) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onTouched" });
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearLoginError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (token && user) {
      toast.success("Login successful!");
      Cookies.set("token", token);
    Cookies.set("role", user.role);
      if(user.role === "ADMIN"){
        router.push("/admin");
      }else{
        router.push("/");
      }
    }
  }, [token,user, router]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await dispatch(loginUser(data));
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 transition ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-shop_dark_green focus:border-shop_dark_green"
    }`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md"
      >
        <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Login
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter username"
            className={inputClass(!!errors.username)}
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            className={inputClass(!!errors.password)}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-xl transition font-medium
                     bg-shop_dark_green/80 border border-shop_dark_green/80
                     text-white hover:bg-shop_dark_green hover:border-shop_dark_green
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-shop_dark_green font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;