"use client";

import { useEffect, useState, useCallback } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { serverUrl } from "@/enviroment";
import { betterAuthClient } from "@/lib/auth";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
  };
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
  };
};

const CommentSection = ({ postId }: { postId: string }) => {
  const { data: session } = betterAuthClient.useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${serverUrl}/comments/on/${postId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments || []);
      } else {
        setMessage("Failed to load comments");
      }
    } catch {
      setMessage("Error loading comments");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!session?.user) {
      setMessage("⚠️ You must be logged in to comment");
      return;
    }

    if (newComment.trim() === "") {
      setMessage("⚠️ Please enter a comment before submitting.");
      return;
    }

    try {
      const res = await fetch(`${serverUrl}/comments/on/${postId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Comment added successfully!");
        setNewComment("");
        fetchComments();
      } else {
        setMessage(data.message || "❌ Failed to add comment.");
      }
    } catch {
      setMessage("❌ Error adding comment.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!session?.user) {
      setMessage("⚠️ You must be logged in to delete comments");
      return;
    }

    const comment = comments.find((c) => c.id === id);
    if (comment?.user.id !== session.user.id) {
      setMessage("⚠️ You can only delete your own comments");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${serverUrl}/comments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setMessage("🗑️ Comment deleted.");
        fetchComments();
      } else {
        setMessage("❌ Failed to delete comment.");
      }
    } catch {
      setMessage("❌ Error deleting comment.");
    }
  };

  const handleEdit = (id: string, currentContent: string) => {
    if (!session?.user) {
      setMessage("⚠️ You must be logged in to edit comments");
      return;
    }

    const comment = comments.find((c) => c.id === id);
    if (comment?.user.id !== session.user.id) {
      setMessage("⚠️ You can only edit your own comments");
      return;
    }

    setEditingCommentId(id);
    setEditContent(currentContent);
  };

  const handleUpdate = async (id: string) => {
    if (!session?.user) {
      setMessage("⚠️ You must be logged in to edit comments");
      return;
    }

    if (!editContent.trim()) {
      setMessage("⚠️ Comment content can't be empty.");
      return;
    }

    try {
      const res = await fetch(`${serverUrl}/comments/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (res.ok) {
        setMessage("✅ Comment updated.");
        setEditingCommentId(null);
        setEditContent("");
        fetchComments();
      } else {
        setMessage("❌ Failed to update comment.");
      }
    } catch {
      setMessage("❌ Error updating comment.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-semibold">Comments</h3>

      {session?.user ? (
        <CommentForm
          newComment={newComment}
          onChange={setNewComment}
          onSubmit={handleSubmit}
        />
      ) : (
        <p className="text-sm text-gray-600">
          Please log in to leave a comment
        </p>
      )}

      {message && (
        <p
          className={`text-sm ${
            message.includes("⚠️") || message.includes("❌")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <CommentList
          comments={comments}
          currentUserId={session?.user?.id || ""}
          editingCommentId={editingCommentId}
          editContent={editContent}
          onEdit={handleEdit}
          onEditChange={setEditContent}
          onCancel={() => setEditingCommentId(null)}
          onSave={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );

};
export default CommentSection;