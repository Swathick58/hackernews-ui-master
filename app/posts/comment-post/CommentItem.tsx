type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
  } | null; // handle null user gracefully
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
  };
};

type CommentItemProps = {
  comment: Comment;
  isEditing: boolean;
  editContent: string;
  onEditChange: (text: string) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
};
// Inside CommentItem
export default function CommentItem({
  comment,
  isEditing,
  editContent,
  onEditChange,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  canEdit,
  canDelete,
}: CommentItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"> {/* Changed from <li> to <div> */}
      <div className="flex justify-between items-start mb-2">
        <span className="font-medium text-gray-700">
          {comment.user?.username ?? "Anonymous"}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>

      {isEditing ? (
        <>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            value={editContent}
            onChange={(e) => onEditChange(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Save Changes
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-800 mb-3 whitespace-pre-wrap">
            {comment.content}
          </p>

          {(canEdit || canDelete) && (
            <div className="flex justify-end gap-3 border-t pt-2">
              {canEdit && (
                <button
                  onClick={onEdit}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
