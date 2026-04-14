import { getEvents, getMembers } from '@/lib/supabase/actions';
import { DetailedEventType } from '@/schema/event';
import EventHistory from './EventHistory';

const EventList = async () => {
  const [events, members] = await Promise.all([
    getEvents({ order: 'desc' }),
    getMembers(),
  ]);

  const detailedEvents: DetailedEventType[] = events.map((event) => {
    const mappedDetailedMembers = event.attendees
      .map((attendee) => {
        const member = members.find((member) => member.id === attendee);
        if (!member) {
          return null;
        }

        return member;
      })
      .filter((member): member is NonNullable<typeof member> => member !== null);

    return {
      ...event,
      attendees: mappedDetailedMembers,
    };
  });

  return (
    <div className="flex flex-col gap-y-6">
      {detailedEvents.map((event) => (
        <EventHistory key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
