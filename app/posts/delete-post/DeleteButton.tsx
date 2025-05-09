"use client";

import { serverUrl } from "@/enviroment";
import { useState } from "react";
import { MdDelete } from "react-icons/md";

type DeleteButtonProps = {
  postId: string;
  postOwnerId: string;
  currentUserId: string;
  onDelete?: () => void; // Optional callback
};

export const DeleteButton = ({
  postId,
  postOwnerId,
  currentUserId,
  onDelete,
}: DeleteButtonProps) => {
  const [loading, setLoading] = useState(false);

  const isOwner = postOwnerId === currentUserId;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const res = await fetch(`${serverUrl}/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        onDelete?.(); // Trigger parent callback to refresh or refetch
      } else {
        alert(data.error || "❌ Failed to delete post.");
      }
    } catch {
      alert("❌ Error deleting post.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) return null;

  return (
    <button
      onClick={handleDelete}
      aria-label="Delete Post"
      className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
    >
      <MdDelete size={18} />
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
};
