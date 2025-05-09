import React from "react";
import CreatePost from "./CreatePost";

import NavigationBar from "@/components/navigation-bar/NavigationBar";

const page = () => {
  return (
    <>
     <NavigationBar />
      <CreatePost />
    </>
  );
};

export default page;
