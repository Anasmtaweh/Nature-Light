"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface CommentFormProps {
  eventId: string;
}

const CommentForm = ({ eventId }: CommentFormProps) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to post a comment.");
      return;
    }

    if (!commentText.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const commentsRef = collection(db, "events", eventId, "comments");
      await addDoc(commentsRef, {
        userId: user.uid,
        userName: user.email || "Anonymous", // Use email as username for now
        commentText,
        timestamp: Timestamp.now(),
      });
      setCommentText("");
    } catch (error: any) {
      alert("Error adding comment: " + error.message);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-4 bg-gray-700 rounded-lg">
        <p>Please log in to post a comment.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-700 rounded-lg">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write your comment here..."
        rows={4}
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Post Comment
      </button>
    </form>
  );
};

export default CommentForm;
