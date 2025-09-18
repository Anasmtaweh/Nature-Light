import { getEvents } from '@/lib/firestore';
import EventCard from '@/components/ui/EventCard';

const CalendarPage = async () => {
  const { events } = await getEvents(); // Destructure events from the returned object

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Events Calendar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default CalendarPage;
