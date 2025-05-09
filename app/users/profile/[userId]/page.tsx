"use client";

import NavigationBar from "@/components/navigation-bar/NavigationBar";
import SectionWrapper from "@/components/section-wrapper/page";
import { serverUrl } from "@/enviroment";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface User {
  id: string;
  name: string | null;
  username: string | null;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  image: string | null;
  posts: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  Comment: Array<{
    id: string;
    content: string;
    createdAt: Date;
    postId: string;
  }>;
  Like: Array<{
    id: string;
    createdAt: Date;
    postId: string;
  }>;
}

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await fetch(`${serverUrl}/users/profile/${userId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch user profile");
      }

      const userData = data.user || data;

      setUser({
        ...userData,
        name: userData.name || userData.username || "Anonymous",
        username: userData.username || "No username",
        posts: userData.posts || [],
        Comment: userData.Comment || [],
        Like: userData.Like || [],
      });
    } catch {
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile, userId]);

  if (loading)
    return (
      <>
        <NavigationBar />
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
          <p>Loading user profile...</p>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <NavigationBar />
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </>
    );

  if (!user)
    return (
      <>
        <NavigationBar />
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
          <p>No user data found.</p>
        </div>
      </>
    );

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <SectionWrapper title={`${user.name || user.username}'s Profile`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">Username: {user.username}</p>
                <p className="text-gray-600 mb-1">Email: {user.email}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-4">
                  Member since: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper title="Posts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {user.posts?.length > 0 ? (
                user.posts.map((post) => (
                  <div
                    key={post.id}
                    className="border p-4 rounded-lg shadow-sm"
                  >
                    <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                    <p className="text-gray-700 mb-3">{post.content}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No posts found.</p>
              )}
            </div>
          </SectionWrapper>

          <SectionWrapper title="Comments">
            <div className="space-y-4">
              {user.Comment?.length > 0 ? (
                user.Comment.map((comment) => (
                  <div key={comment.id} className="border p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">{comment.content}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Post ID: {comment.postId}</span>
                      <span>
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments found.</p>
              )}
            </div>
          </SectionWrapper>

          <SectionWrapper title="Likes">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.Like?.length > 0 ? (
                user.Like.map((like) => (
                  <div key={like.id} className="border p-3 rounded-lg">
                    <p className="font-medium">Post ID: {like.postId}</p>
                    <p className="text-gray-500 text-sm">
                      Liked on: {new Date(like.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No likes found.</p>
              )}
            </div>
          </SectionWrapper>
        </div>
      </div>
    </>
  );
}
