import React from "react";
import PastPosts from "./PastPost";
import NavigationBar from "@/components/navigation-bar/NavigationBar";

const page = () => {
  return (
    <>
      <div className=" mx-auto max-w-7xl  bg-[#F6F6EF] h-screen">
        <NavigationBar />
        <PastPosts />
      </div>
    </>
  );
};

export default page;
