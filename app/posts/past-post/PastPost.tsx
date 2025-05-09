"use client";
import { serverUrl } from "@/enviroment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    name?: string;
  };
}

const PastPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 4;
  const router = useRouter();
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${serverUrl}/posts/past?page=${page}&limit=${limit}`, {
            credentials: "include",
            method: "GET",
          }
     
          
        );
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        } else {
          setError(data.error || "Failed to fetch posts");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16">
      <h2 className="text-xl font-semibold mb-6">Posts (Yesterday)</h2>
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-gray-700 mt-2">{post.content}</p>
            <div className="mt-3 text-sm text-gray-500">
              <span>{new Date(post.createdAt).toLocaleString()}</span>
              <span className="mx-2">•</span>
              <Link
                href={`/users/profile/${post.author.id}`}
                className="hover:text-blue-600 hover:underline"
              >
                {post.author.name || post.author.username}
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="fixed bottom-2 left-0 right-0 flex justify-center">
        <div
          className="flex gap-4 bg-white p-3 rounded-lg shadow-md border border-gray-200"
          onClick={() => {
            router.refresh();
          }}
        >
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={posts.length < limit}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PastPosts;
