
import CommentItem from "./CommentItem";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string; // Made required to properly check ownership
    username: string;
  };
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
  };
};

type CommentListProps = {
  comments: Comment[];
  editingCommentId: string | null;
  editContent: string;
  onEdit: (id: string, content: string) => void;
  onEditChange: (value: string) => void;
  onCancel: () => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  currentUserId: string; // Added to props to avoid duplicate session calls
};

export default function CommentList({
  comments,
  editingCommentId,
  editContent,
  onEdit,
  onEditChange,
  onCancel,
  onSave,
  onDelete,
  currentUserId,
}: CommentListProps) {
  return (
    <ul className="space-y-4 divide-y divide-gray-200">
      {comments.map((comment) => (
        <li key={comment.id} className="pt-4 first:pt-0">
          <CommentItem
            comment={comment}
            isEditing={editingCommentId === comment.id}
            editContent={editContent}
            onEdit={() => onEdit(comment.id, comment.content)}
            onEditChange={onEditChange}
            onCancel={onCancel}
            onSave={() => onSave(comment.id)}
            onDelete={() => onDelete(comment.id)}
            canEdit={currentUserId === comment.user.id}
            canDelete={currentUserId === comment.user.id}
          />
          {/* Added visual separator between comments */}
        </li>
      ))}
    </ul>
  );
}