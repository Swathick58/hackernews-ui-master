import React from "react";
import NewPosts from "./NewPost";
import NavigationBar from "@/components/navigation-bar/NavigationBar";

const page = () => {
  return (
    <>
      <div className=" mx-auto max-w-7xl  bg-[#F6F6EF] h-screen">
    <NavigationBar/>
        <NewPosts />
      </div>
    </>
  );
};

export default page;
