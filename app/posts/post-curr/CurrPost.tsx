"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { serverUrl } from "@/enviroment";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function CurrPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${serverUrl}/posts/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to fetch posts");
        } else {
          setPosts(data.posts || data);
        }
      } catch {
        setError("Something went wrong while fetching posts");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading your posts...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 max-w-md text-center px-4">{error}</p>
      </div>
    );

  if (posts.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-2">No posts found</h2>
          <p className="">You haven&apos;t created any posts yet</p>
          <Link
            href="/posts/create-post"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Posts</h1>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                  {post.title}
                </h2>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/posts/${post.id}`);
                    }}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    View Post
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
