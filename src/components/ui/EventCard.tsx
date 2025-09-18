"use client"; // Make it a client component

import Link from 'next/link';
import { SkyEvent } from '@/types';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { db } from '@/lib/firebase'; // Import db
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { useState, useEffect } from 'react'; // Import useState, useEffect

interface EventCardProps {
  event: SkyEvent;
}

const EventCard = ({ event }: EventCardProps) => {
  const { user, loading } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && event.id) {
        const favoriteRef = doc(db, "userFavorites", user.uid, "favorites", event.id);
        const docSnap = await getDoc(favoriteRef);
        setIsFavorited(docSnap.exists());
      } else {
        setIsFavorited(false);
      }
    };
    checkFavoriteStatus();
  }, [user, event.id]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert("You must be logged in to favorite an event.");
      return;
    }

    const favoriteRef = doc(db, "userFavorites", user.uid, "favorites", event.id);

    try {
      if (isFavorited) {
        await deleteDoc(favoriteRef);
        setIsFavorited(false);
        alert("Event removed from favorites!");
      } else {
        await setDoc(favoriteRef, {
          eventId: event.id,
          title: event.title,
          date: event.date,
          // You might want to store more event details here to avoid extra reads later
        });
        setIsFavorited(true);
        alert("Event added to favorites!");
      }
    } catch (error: any) {
      alert("Error updating favorite status: " + error.message);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
      <p className="text-gray-400 mb-4">{event.date}</p>
      <p className="mb-4">{event.description}</p>
      <div className="flex justify-between items-center">
        <Link href={`/events/${event.id}`} className="text-blue-400 hover:underline">
          Read more
        </Link>
        {!loading && user && ( // Show favorite button only if logged in
          <button
            onClick={handleFavoriteToggle}
            className={`py-1 px-3 rounded text-sm ${
              isFavorited ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-600 hover:bg-gray-700"
            } text-white`}
          >
            {isFavorited ? "Favorited" : "Favorite"}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;