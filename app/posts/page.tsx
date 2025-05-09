"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LikeButton } from "./like-post/LikeButton";
import { DeleteButton } from "./delete-post/DeleteButton";
import { betterAuthClient } from "@/lib/auth";
import { serverUrl } from "@/enviroment";
import Link from "next/link";

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    name?: string;
  };
  comments?: {
    id: string;
    content: string;
    createdAt: string;
    userId: string;
    user: {
      id: string;
      username: string;
      name?: string;
    };
  }[];
  likes?: {
    id: string;
    createdAt: string;
    userId: string;
    user: {
      id: string;
      username: string;
      name?: string;
    };
  }[];
}

interface ApiResponse {
  posts: Post[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function PostList() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 4;
  const { data } = betterAuthClient.useSession();
  const currUser = data?.user.id || "";

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${serverUrl}/posts?page=${page}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseData: ApiResponse = await res.json();

      console.log("API Response:", responseData);
      console.log("Total Pages:", responseData.totalPages);

      setPosts(responseData.posts || []);
      setTotalPages(responseData.totalPages);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [page, fetchPosts]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-gray-500">Loading posts...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-red-500 max-w-md px-4">{error}</p>
      </div>
    );

  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-gray-500">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-2 pb-10">
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
          >
            <div
              onClick={() => router.push(`/posts/${post.id}`)}
              className="cursor-pointer mb-4"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 line-clamp-3">{post.content}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 border-t border-gray-100">
              <div className="text-sm text-gray-500 sm:mb-0">
                <span>{new Date(post.createdAt).toLocaleString()}</span>
                <span className="mx-2">•</span>
                <Link
                  href={`/users/profile/${post.author.id}`}
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.author?.name || post.author?.username || "Unknown"}
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/posts/comment-post/${post.id}`);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Comments
                </button>

                <LikeButton postId={post.id} currentUserId={currUser} />

                {post.author?.id === currUser && (
                  <DeleteButton
                    postId={post.id}
                    currentUserId={currUser}
                    postOwnerId={post.author.id}
                    onDelete={fetchPosts}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-2 left-0 right-0 flex justify-center">
        <div className="flex gap-4 bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= totalPages}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
