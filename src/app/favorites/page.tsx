"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { SkyEvent } from '@/types';
import EventCard from '@/components/ui/EventCard';

const FavoritesPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [favoriteEvents, setFavoriteEvents] = useState<SkyEvent[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        setLoadingFavorites(true);
        const favoritesCollectionRef = collection(db, "userFavorites", user.uid, "favorites");
        const favoriteDocs = await getDocs(favoritesCollectionRef);

        const favoritedEventIds: string[] = [];
        favoriteDocs.forEach(doc => {
          favoritedEventIds.push(doc.id);
        });

        const eventsData: SkyEvent[] = [];
        for (const eventId of favoritedEventIds) {
          const eventDocRef = doc(db, "events", eventId);
          const eventDocSnap = await getDoc(eventDocRef);
          if (eventDocSnap.exists()) {
            const data = eventDocSnap.data();
            eventsData.push({
              id: eventDocSnap.id,
              title: data.title,
              date: data.date.toDate().toISOString().split('T')[0],
              description: data.description,
              location: data.location,
              visibility: data.visibility,
              city: data.city || null,
              state: data.state || null,
              country: data.country || null,
            });
          }
        }
        setFavoriteEvents(eventsData);
        setLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, [user]); // Refetch when user changes

  if (loading) {
    return <div className="text-center text-xl mt-8">Loading user data...</div>;
  }

  if (!user) {
    return null; // Redirecting to login
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">My Favorite Events</h1>
      {loadingFavorites ? (
        <div className="text-center">Loading favorites...</div>
      ) : favoriteEvents.length === 0 ? (
        <div className="text-center">You haven't favorited any events yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
