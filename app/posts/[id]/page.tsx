import Navbar from "@/components/navigation-bar/NavigationBar";
import { serverUrl } from "@/enviroment";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
  };
  Comment: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      username: string;
    };
  }[];
};

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const res = await fetch(`${serverUrl}/posts/${id}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-red-500">Post not found</h1>
      </div>
    );
  }

  const data = await res.json();
  const post: Post = data.post;

  return (
    <>
      <div className="bg-[#F6F6EF] h-screen mx-auto max-w-7xl">
        <div>
          <Navbar />
        </div>
        <div className="mx-auto max-w-7xl p-4 ">
          <div className=" p-2 border  cursor-pointer hover:bg-gray-50 transition">
            <h1 className="text-[16px] font-bold">{post.title}</h1>
            <p className="text-gray-500 text-[12px] mb-2">
              {new Date(post.createdAt).toLocaleString()} by{" "}
              {post.author.username}
            </p>
            <p className="text-[15px]">{post.content}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
