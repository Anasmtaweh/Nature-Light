"use client";

import { useState, useEffect, useCallback } from 'react';
import EventList from '@/components/EventList';
import { getEvents } from '@/lib/firestore';
import { SkyEvent } from '@/types';
import { reverseGeocode } from '@/lib/location';
import { DocumentData } from 'firebase/firestore';

const predefinedLocations = [
  "All",
  "Northern Hemisphere",
  "North America, South America, Europe, Africa",
  "Visible worldwide",
];

const HomePage = () => {
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<SkyEvent[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [geocodedLocation, setGeocodedLocation] = useState<string | null>(null);
  const [availableLocations, setAvailableLocations] = useState<string[]>(predefinedLocations);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const fetchInitialEvents = useCallback(async () => {
    setLoadingEvents(true);
    const { events: fetchedEvents, lastVisible: newLastVisible } = await getEvents(9, null);
    setEvents(fetchedEvents);
    setLastVisible(newLastVisible);
    setHasMore(fetchedEvents.length === 9); // If less than 9, no more to load
    setLoadingEvents(false);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || !lastVisible) return;

    setLoadingEvents(true);
    const { events: fetchedEvents, lastVisible: newLastVisible } = await getEvents(9, lastVisible);
    setEvents((prevEvents) => [...prevEvents, ...fetchedEvents]);
    setLastVisible(newLastVisible);
    setHasMore(fetchedEvents.length === 9);
    setLoadingEvents(false);
  }, [hasMore, lastVisible]);

  useEffect(() => {
    fetchInitialEvents();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.error("Error getting user location:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location access denied. Please enable location services in your browser settings.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("The request to get user location timed out.");
              break;
            default:
              setLocationError("An unknown error occurred while getting your location.");
              break;
          }
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, [fetchInitialEvents]);

  useEffect(() => {
    const getGeocodedLocation = async () => {
      if (userLocation) {
        const locationName = await reverseGeocode(userLocation.lat, userLocation.lon);
        if (locationName) {
          setGeocodedLocation(locationName);
          setAvailableLocations((prevLocations) => {
            if (!prevLocations.includes(locationName)) {
              return [...prevLocations, locationName];
            }
            return prevLocations;
          });
          setSelectedLocation(locationName);
        }
      }
    };
    getGeocodedLocation();
  }, [userLocation]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Upcoming Sky Events</h1>
      <p className="mb-8">
        Explore the wonders of the night sky. Here are some of the upcoming celestial events.
      </p>

      {locationError && (
        <div className="bg-red-800 text-white p-3 rounded mb-4">
          {locationError}
        </div>
      )}

      {userLocation && (
        <div className="bg-green-800 text-white p-3 rounded mb-4">
          Your current location: Latitude {userLocation.lat.toFixed(4)}, Longitude {userLocation.lon.toFixed(4)}
          {geocodedLocation && ` (near ${geocodedLocation})`}
        </div>
      )}

      <div className="mb-8 flex space-x-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">Search Events</label>
          <input
            id="search"
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="location" className="sr-only">Filter by location</label>
          <select
            id="location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            {availableLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loadingEvents && events.length === 0 ? (
        <div className="text-center text-xl mt-8">Loading events...</div>
      ) : (
        <EventList events={events} selectedLocation={selectedLocation} searchQuery={searchQuery} />
      )}

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingEvents}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loadingEvents ? "Loading more..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;