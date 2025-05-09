type CommentFormProps = {
  newComment: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CommentForm({
  newComment,
  onChange,
  onSubmit,
}: CommentFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        value={newComment}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a comment..."
        className="border p-2 flex-1"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Post
      </button>
    </form>
  );
}
