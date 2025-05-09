"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { betterAuthClient } from "@/lib/auth";
import { serverUrl } from "@/enviroment";

const CreatePostPage = () => {
  const { data: session } = betterAuthClient.useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Title is required!");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${serverUrl}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
        }),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create post");
      }
      const data = await res.json();
      console.log("Post created:", data);
      alert("Post created successfully!");
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Create post error:", error);
        alert(error.message || "An error occurred while creating post.");
      } else {
        console.error("Unknown error:", error);
        alert("An unknown error occurred while creating post.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F1F1DB]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            You must be logged in to create a post!
          </h2>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F1F1DB]">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-amber-900 text-center">
          Create a New Post
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating post..." : "Create Post"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CreatePostPage;
