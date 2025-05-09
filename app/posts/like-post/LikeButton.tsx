"use client";

import { useState, useEffect, useCallback } from "react";
import { getLikes, likePost, unlikePost } from "./api";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";

type Props = {
  postId: string;
  currentUserId: string;
};

export const LikeButton = ({ postId, currentUserId }: Props) => {
  const [likes, setLikes] = useState<
    { id: string; user: { id: string; name: string | null } }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const fetchLikes = useCallback(async () => {
    const res = await getLikes(postId);
    if (res.status === "SUCCESS") {
      setLikes(res.likes);
      setLikeCount(res.likes.length);
    } else {
      setLikes([]);
      setLikeCount(0);
    }
  }, [postId]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  useEffect(() => {
    const isLiked = likes.some((like) => like.user.id === currentUserId);
    setLiked(isLiked);
  }, [likes, currentUserId]);

  const handleLike = async () => {
    setLoading(true);
    const res = await likePost(postId);
    if (res.status === "SUCCESS") {
      setLikeCount((prevCount) => prevCount + 1);
    }
    await fetchLikes();
    setLiked(true);
    setLoading(false);
  };

  const handleUnlike = async () => {
    setLoading(true);
    const res = await unlikePost(postId);
    if (res.status === "SUCCESS") {
      setLikeCount((prevCount) => Math.max(prevCount - 1, 0));
    }
    await fetchLikes();
    setLiked(false);
    setLoading(false);
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      <button
        onClick={liked ? handleUnlike : handleLike}
        disabled={loading}
        className={`text-xl ${liked ? "text-blue-500" : "text-red-700"} transition-colors duration-200`}
        aria-label={liked ? "Unlike" : "Like"}
      >
        {liked ? <SlDislike size={15} /> : <SlLike size={15} />}
      </button>
      <span className="ml-2">{likeCount}</span>
    </div>
  );
};
