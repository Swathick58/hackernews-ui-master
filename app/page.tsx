// app/page.tsx


import NavigationBar from "@/components/navigation-bar/NavigationBar";
import PostList from "./posts/page";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto bg-[#f1f1db] min-h-screen">
      <NavigationBar/>
      <PostList />
    </div>
  );
}
