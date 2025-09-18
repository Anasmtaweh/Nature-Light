import { getEventById } from '@/lib/firestore';
import { getWeatherData } from '@/lib/weather';
import CommentList from '@/components/comments/CommentList';
import CommentForm from '@/components/comments/CommentForm';

interface EventPageProps {
  params: {
    id: string;
  };
}

const EventPage = async ({ params }: EventPageProps) => {
  const event = await getEventById(params.id);

  if (!event) {
    return <div>Event not found</div>;
  }

  const weather = await getWeatherData(event.location, event.date);

  const getVisibilityTips = (visibility: string) => {
    switch (visibility.toLowerCase()) {
      case 'excellent':
        return "This event has excellent visibility! Find a dark sky location away from city lights for the best experience. Consider bringing binoculars or a telescope.";
      case 'good':
        return "Visibility is good for this event. Look for a spot with minimal light pollution. Binoculars might enhance your view.";
      case 'fair':
        return "Fair visibility expected. Try to observe from a location with low light pollution. Atmospheric conditions might affect the view.";
      case 'poor':
        return "Visibility is poor for this event. It might be challenging to observe without specialized equipment or very dark skies.";
      default:
        return "General tips: Find a clear view of the sky, away from obstructions like buildings and trees. Check local weather for cloud cover.";
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-400 mb-4">{event.date}</p>
      <p className="mb-4">{event.description}</p>
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h2 className="text-2xl font-bold mb-2">Event Details</h2>
        <p><strong>Location:</strong> {event.location}</p>
        {event.city && <p><strong>City:</strong> {event.city}</p>}
        {event.state && <p><strong>State:</strong> {event.state}</p>}
        {event.country && <p><strong>Country:</strong> {event.country}</p>}
        <p><strong>Visibility:</strong> {event.visibility}</p>
      </div>

      {weather && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h2 className="text-2xl font-bold mb-2">Weather Forecast for {weather.city}</h2>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Conditions: {weather.description}</p>
          {weather.icon && (
            <img
              src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
              alt={weather.description}
              className="inline-block ml-2"
            />
          )}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h2 className="text-2xl font-bold mb-2">Visibility Tips</h2>
        <p>{getVisibilityTips(event.visibility)}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4">Comments</h2>
        <CommentForm eventId={event.id} />
        <CommentList eventId={event.id} />
      </div>
    </div>
  );
};

export default EventPage;
