import React from "react";
import { LikeButton } from "../LikeButton";
import { betterAuthClient } from "@/lib/auth";


const LikePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const { data } = betterAuthClient.useSession();
    const currUser = data?.user.id;
   
   

  return (
    <>
      <LikeButton postId={id} currentUserId={currUser|| ""} />
    </>
  );
};

export default LikePage;
