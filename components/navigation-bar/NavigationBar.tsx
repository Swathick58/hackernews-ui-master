"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { betterAuthClient } from "@/lib/auth";

interface NavigationBarProps {
  hideNavItems?: boolean;
}

const navItems = [
  { label: "new", path: "/posts/new-post" },
  { label: "past", path: "/posts/past-post" },
  { label: "create post", path:"/posts/create-post" },
  { label: "my post", path: "/posts/post-curr" },
];

const NavigationBar: React.FC<NavigationBarProps> = ({
  hideNavItems = false,
}) => {
  const router = useRouter();
  const { data } = betterAuthClient.useSession();
  const user = data?.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await betterAuthClient.signOut();
    router.push("/");
    setIsMenuOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto sticky top-0 z-50">
      <div className="bg-[#ff6600] text-black text-sm w-full p-2">
        <div className="max-w-screen-xl mx-auto px-2 py-1 flex justify-between items-center">
          {/* Left side - Logo and Desktop Nav */}
          <div className="flex items-center gap-2">
            <span className="bg-orange-700 text-white font-bold px-1 cursor-pointer hidden sm:block">
              Y
            </span>
            <span
              onClick={() => handleNavigation("/")}
              className="font-bold cursor-pointer"
            >
              Hacker News
            </span>

            {/* Desktop Navigation Items */}
            {!hideNavItems && (
              <div className="hidden md:flex ml-2 space-x-1">
                {navItems.map((item, index) => (
                  <React.Fragment key={item.label}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className="cursor-pointer hover:underline whitespace-nowrap"
                    >
                      {item.label}
                    </button>
                    {index < navItems.length - 1 && <span>|</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Right side - Auth Links (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {!hideNavItems &&
              (user ? (
                <>
                  <Link href="/users/my-profile" prefetch={false}>
                    <span className="cursor-pointer hover:underline">
                      {user.name}
                    </span>
                  </Link>
                  <span>|</span>
                  <button
                    onClick={handleSignOut}
                    className="hover:underline cursor-pointer"
                  >
                    logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigation("/login")}
                  className="hover:underline cursor-pointer"
                >
                  login
                </button>
              ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#ff6600] px-2 pt-2 pb-4">
            {/* Mobile Navigation Items */}
            {!hideNavItems && (
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.path)}
                    className="cursor-pointer hover:underline text-left py-1"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* Mobile Auth Links */}
            <div className="mt-4 pt-2 border-t border-orange-700">
              {!hideNavItems &&
                (user ? (
                  <div className="flex flex-col space-y-2">
                    <Link href="/users/my-profile" prefetch={false}>
                      <span className="cursor-pointer hover:underline py-1 block">
                        {user.name}
                      </span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="hover:underline cursor-pointer text-left py-1"
                    >
                      logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="hover:underline cursor-pointer text-left py-1"
                  >
                    login
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
