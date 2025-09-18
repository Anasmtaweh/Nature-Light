"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/admin/EventForm';
import EditEventForm from '@/components/admin/EditEventForm';
import { useAuth } from '@/context/AuthContext';
import { getEvents, deleteEvent } from '@/lib/firestore';
import { SkyEvent } from '@/types';

const AdminPage = () => {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<SkyEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SkyEvent | null>(null);

  const refreshEvents = useCallback(async () => {
    setLoadingEvents(true);
    const { events: fetchedEvents } = await getEvents(); // Destructure events
    setEvents(fetchedEvents);
    setLoadingEvents(false);
  }, []);

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, role, router]);

  useEffect(() => {
    if (user && role === 'admin') {
      refreshEvents();
    }
  }, [user, role, refreshEvents]);

  const handleDelete = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        alert("Event deleted successfully!");
        refreshEvents();
      } catch (error: any) {
        alert("Error deleting event: " + error.message);
      }
    }
  };

  const handleEdit = (event: SkyEvent) => {
    setSelectedEvent(event);
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedEvent(null);
  };

  const handleSaveEditForm = () => {
    refreshEvents();
  };

  if (loading) {
    return <div className="text-center text-xl mt-8">Loading authentication...</div>;
  }

  if (!user || role !== 'admin') {
    return <div className="text-center text-xl mt-8">Access Denied. You must be an administrator to view this page.</div>;
  }

  return (
    <div className="relative"> 
      <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
      <p className="mb-8">
        Manage events in your database.
      </p>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Add New Event</h2>
        <EventForm />
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4">Existing Events</h2>
        {loadingEvents ? (
          <div className="text-center">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-gray-400 text-sm">{event.date}</p>
                <p className="text-gray-300 mt-2 line-clamp-2">{event.description}</p>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditForm && selectedEvent && (
        <EditEventForm
          event={selectedEvent}
          onClose={handleCloseEditForm}
          onSave={handleSaveEditForm}
        />
      )}
    </div>
  );
};

export default AdminPage;
