"use client";

import { useState, useEffect } from "react";
import { SkyEvent } from "@/types";
import { updateEvent } from "@/lib/firestore";

interface EditEventFormProps {
  event: SkyEvent;
  onClose: () => void;
  onSave: () => void;
}

const EditEventForm = ({ event, onClose, onSave }: EditEventFormProps) => {
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date); // Date is already string from Firestore read
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.location);
  const [visibility, setVisibility] = useState(event.visibility);
  const [city, setCity] = useState(event.city || "");
  const [state, setState] = useState(event.state || "");
  const [country, setCountry] = useState(event.country || "");

  useEffect(() => {
    // Update form fields if the event prop changes (e.g., when selecting a different event to edit)
    setTitle(event.title);
    setDate(event.date);
    setDescription(event.description);
    setLocation(event.location);
    setVisibility(event.visibility);
    setCity(event.city || "");
    setState(event.state || "");
    setCountry(event.country || "");
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !description || !location || !visibility) {
      alert("Please fill out all required fields (Title, Date, Description, Location, Visibility)");
      return;
    }

    try {
      await updateEvent(event.id, {
        title,
        date,
        description,
        location,
        visibility,
        city: city || null,
        state: state || null,
        country: country || null,
      });
      alert("Event updated successfully!");
      onSave(); // Notify parent to refresh list
      onClose(); // Close the form
    } catch (error: any) {
      alert("Error updating event: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block mb-2">Title</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="edit-date" className="block mb-2">Date</label>
            <input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="block mb-2">Description</label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="edit-location" className="block mb-2">General Location</label>
            <input
              id="edit-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="edit-city" className="block mb-2">City (Optional)</label>
            <input
              id="edit-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="edit-state" className="block mb-2">State/Region (Optional)</label>
            <input
              id="edit-state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="edit-country" className="block mb-2">Country (Optional)</label>
            <input
              id="edit-country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="edit-visibility" className="block mb-2">Visibility</label>
            <input
              id="edit-visibility"
              type="text"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventForm;
