"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, DocumentData } from "firebase/firestore";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  commentText: string;
  timestamp: string; // Will be converted from Firebase Timestamp
}

interface CommentListProps {
  eventId: string;
}

const CommentList = ({ eventId }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const commentsRef = collection(db, "events", eventId, "comments");
    const q = query(commentsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData: Comment[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          commentText: data.commentText,
          timestamp: data.timestamp?.toDate().toLocaleString() || "N/A",
        };
      });
      setComments(commentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [eventId]);

  if (loading) {
    return <div className="text-center">Loading comments...</div>;
  }

  if (comments.length === 0) {
    return <div className="text-center">No comments yet.</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-700 p-4 rounded-lg">
          <p className="font-bold">{comment.userName}</p>
          <p className="text-sm text-gray-400">{comment.timestamp}</p>
          <p className="mt-2">{comment.commentText}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
