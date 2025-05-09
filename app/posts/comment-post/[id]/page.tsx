import Navbar from "@/components/navigation-bar/NavigationBar";
import CommentSection from "../CommentSection";
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
  console.log(id);
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
      <div>
        <Navbar />
      </div>
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="text-gray-500 mb-2">
          {new Date(post.createdAt).toLocaleString()} by {post.author.username}
        </p>
        <p className="mb-4">{post.content}</p>

        <CommentSection postId={id} />
      </div>
    </>
  );
};

export default page;
