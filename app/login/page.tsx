"use client";


import { useRouter } from "next/navigation";
import React, { useState } from "react";

import Link from "next/link";
import { betterAuthClient } from "@/lib/auth";
import NavigationBar from "@/components/navigation-bar/NavigationBar";

const LoginPage = () => {
  const { data } = betterAuthClient.useSession();
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await betterAuthClient.signIn.username({
        username: loginData.username,
        password: loginData.password,
      });

      if ("data" in response && response.data?.user) {
        router.push("/");
      } else {
        alert("Login failed. Please check your username and password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavigationBar hideNavItems />
      {!data?.user && (
        <div className="max-w-7xl mx-auto min-h-[calc(100vh-3rem)] flex items-center justify-center bg-[#f1f1db]">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter your password"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full mt-4 bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
              <div className="flex justify-center text-sm mt-4">
                <span className="text-black">
                  Don&apos;t have an account?&nbsp;
                </span>
                <Link href="/sign-up" className="text-blue-600 hover:underline">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
