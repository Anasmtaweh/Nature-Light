import EventCard from '@/components/ui/EventCard';
import { SkyEvent } from '@/types';

interface EventListProps {
  events: SkyEvent[];
  selectedLocation: string;
  searchQuery: string;
}

const EventList = ({ events, selectedLocation, searchQuery }: EventListProps) => {
  const lowerCaseSearchQuery = searchQuery.toLowerCase();

  // Ensure events is an array before filtering
  const filteredEvents = (Array.isArray(events) ? events : []).filter((event) => {
    // Location filtering logic
    const matchesLocation = () => {
      if (selectedLocation === 'All') {
        return true;
      }
      if (event.location === selectedLocation) {
        return true;
      }
      if (event.city && event.city === selectedLocation) {
        return true;
      }
      if (event.state && event.state === selectedLocation) {
        return true;
      }
      if (event.country && event.country === selectedLocation) {
        return true;
      }
      return false;
    };

    // Search query filtering logic
    const matchesSearchQuery = () => {
      if (!searchQuery) {
        return true;
      }
      return (
        event.title.toLowerCase().includes(lowerCaseSearchQuery) ||
        event.description.toLowerCase().includes(lowerCaseSearchQuery) ||
        event.location.toLowerCase().includes(lowerCaseSearchQuery) ||
        (event.city && event.city.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (event.state && event.state.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (event.country && event.country.toLowerCase().includes(lowerCaseSearchQuery))
      );
    };

    return matchesLocation() && matchesSearchQuery();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;