import { db } from './firebase';
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc, Timestamp, query, orderBy, limit, startAfter, DocumentData } from 'firebase/firestore'; // Import query, orderBy, limit, startAfter, DocumentData
import { SkyEvent } from '@/types';

export const getEvents = async (limitCount: number = 9, lastDoc: DocumentData | null = null): Promise<{ events: SkyEvent[], lastVisible: DocumentData | null }> => {
  const eventsCol = collection(db, 'events');
  let q = query(eventsCol, orderBy('date', 'desc'), limit(limitCount)); // Order by date for consistent pagination

  if (lastDoc) {
    q = query(eventsCol, orderBy('date', 'desc'), startAfter(lastDoc), limit(limitCount));
  }

  const eventSnapshot = await getDocs(q);
  const eventList = eventSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      date: data.date.toDate().toISOString().split('T')[0], // Convert timestamp to string
      description: data.description,
      location: data.location,
      visibility: data.visibility,
      city: data.city || null,
      state: data.state || null,
      country: data.country || null,
    };
  });

  const lastVisible = eventSnapshot.docs.length > 0 ? eventSnapshot.docs[eventSnapshot.docs.length - 1] : null;

  return { events: eventList, lastVisible };
};

export const getEventById = async (id: string): Promise<SkyEvent | null> => {
  const eventDoc = doc(db, 'events', id);
  const eventSnapshot = await getDoc(eventDoc);

  if (eventSnapshot.exists()) {
    const data = eventSnapshot.data();
    return {
      id: eventSnapshot.id,
      title: data.title,
      date: data.date.toDate().toISOString().split('T')[0],
      description: data.description,
      location: data.location,
      visibility: data.visibility,
      city: data.city || null,
      state: data.state || null,
      country: data.country || null,
    };
  } else {
    return null;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'events', id));
};

export const updateEvent = async (id: string, eventData: Partial<SkyEvent>): Promise<void> => {
  const eventRef = doc(db, 'events', id);
  const dataToUpdate: any = { ...eventData };
  if (dataToUpdate.date) {
    dataToUpdate.date = Timestamp.fromDate(new Date(dataToUpdate.date));
  }
  await updateDoc(eventRef, dataToUpdate);
};
