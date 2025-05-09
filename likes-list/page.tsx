import React from "react";

type Like = {
  id: string;
  user: {
    id: string;
    name: string | null;
  };
};

type LikesListProps = {
  likes: Like[];
  currentUserId: string; // Add currentUserId parameter
  postId: string; // Add postId parameter
};

const LikesList = ({ likes, currentUserId }: LikesListProps) => {
  return (
    <div>
      <h3 className="mt-4 font-semibold">Likes:</h3>
      <ul className="list-disc list-inside">
        {likes.length === 0 ? (
          <li>No users have liked this post yet.</li>
        ) : (
          likes.map((like) => (
            <li
              key={like.id}
              style={{
                fontWeight: like.user.id === currentUserId ? "bold" : "normal", // Highlight the current user's like
              }}
            >
              {like.user.name} {like.user.id === currentUserId && "(You)"}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default LikesList;
