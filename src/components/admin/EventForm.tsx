"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const EventForm = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState("");
  const [city, setCity] = useState(""); // New state
  const [state, setState] = useState(""); // New state
  const [country, setCountry] = useState(""); // New state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !description || !location || !visibility) {
      alert("Please fill out all required fields (Title, Date, Description, Location, Visibility)");
      return;
    }

    const eventsCol = collection(db, "events");
    await addDoc(eventsCol, {
      title,
      date: Timestamp.fromDate(new Date(date)),
      description,
      location,
      visibility,
      city: city || null, // Save as null if empty
      state: state || null, // Save as null if empty
      country: country || null, // Save as null if empty
    });

    setTitle("");
    setDate("");
    setDescription("");
    setLocation("");
    setVisibility("");
    setCity(""); // Clear new fields
    setState(""); // Clear new fields
    setCountry(""); // Clear new fields

    alert("Event added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="date" className="block mb-2">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="location" className="block mb-2">General Location (e.g., Northern Hemisphere)</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="city" className="block mb-2">City (Optional)</label>
        <input
          id="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="state" className="block mb-2">State/Region (Optional)</label>
        <input
          id="state"
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="country" className="block mb-2">Country (Optional)</label>
        <input
          id="country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="visibility" className="block mb-2">Visibility</label>
        <input
          id="visibility"
          type="text"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Event
      </button>
    </form>
  );
};

export default EventForm;
