import { getEvents, getUsers } from '@/lib/supabase/actions';
import { DetailedEventType } from '@/schema/event';
import EventHistory from './EventHistory';

const EventList = async () => {
  const [events, users] = await Promise.all([getEvents(), getUsers()]);

  const detailedEvents: DetailedEventType[] = events
    .map((event) => {
      const mappedDetailedUsers = event.attendees
        .map((attendee) => {
          const user = users.find((user) => user.id === attendee);
          if (!user) {
            return null;
          }

          return user;
        })
        .filter((user): user is NonNullable<typeof user> => user !== null);

      return {
        ...event,
        attendees: mappedDetailedUsers,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      {detailedEvents.map((event) => (
        <EventHistory key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
