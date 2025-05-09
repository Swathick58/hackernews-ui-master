"use client";

import { useEffect, useState } from "react";
import { serverUrl } from "@/enviroment";

type User = {
  id: string;
  username: string;
  name: string;
};

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const fetchUsers = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${serverUrl}/users?page=${currentPage}&limit=5`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      setUsers(data.users || data); // depends how your GetUsers returns
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Users List</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
            </div>
            <span className="text-gray-400 text-xs">ID: {user.id}</span>
          </div>
        ))
      )}

      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
}
