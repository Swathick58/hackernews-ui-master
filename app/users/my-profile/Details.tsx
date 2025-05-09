"use client";

import { useEffect, useState } from "react";
import { serverUrl } from "@/enviroment";
import SectionWrapper from "@/components/section-wrapper/page";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
}

interface Like {
  id: string;
  createdAt: string;
  postId: string;
}

interface User {
  id: string;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  emailVerified: boolean;
  image: string;
  posts: Post[];
  Comment: Comment[];
  Like: Like[];
}

export default function MyProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMe = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${serverUrl}/users/me`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch profile");
      }

      setUser(data.user);
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  if (loading) return <p className="text-center p-4">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500 p-4">{error}</p>;
  if (!user) return <p className="text-center p-4">No user data found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="border p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>
        <div className="space-y-8">
          <SectionWrapper title="User Information">
            <div className="space-y-4 mb-8">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
          </SectionWrapper>

          {/* Posts */}
          <SectionWrapper title="Posts">
            {user.posts.length > 0 ? (
              <ul className="list-disc ml-5 space-y-2">
                {user.posts.map((post) => (
                  <li key={post.id}>
                    <strong>{post.title}</strong> - {post.content}
                    <div className="text-gray-500 text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No posts found.</p>
            )}
          </SectionWrapper>

          {/* Comments */}
          <SectionWrapper title="Comments">
            {user.Comment.length > 0 ? (
              <ul className="list-disc ml-5 space-y-2">
                {user.Comment.map((comment) => (
                  <li key={comment.id}>
                    {comment.content}
                    <div className="text-gray-500 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments found.</p>
            )}
          </SectionWrapper>

          {/* Likes */}
          <SectionWrapper title="Likes">
            {user.Like.length > 0 ? (
              <ul className="list-disc ml-5 space-y-2">
                {user.Like.map((like) => (
                  <li key={like.id}>
                    Liked Post ID: {like.postId}
                    <div className="text-gray-500 text-sm">
                      {new Date(like.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No likes found.</p>
            )}
          </SectionWrapper>
        </div>
      </div>
    </div>
  );
}

// Section Wrapper Component
