import ClassAvatar from '@/components/custom/ClassAvatar';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { formatDate } from '@/lib/utils';
import { DetailedEventType } from '@/schema/event';

type EventHistoryProps = {
  event: DetailedEventType;
};

const EventHistory = ({ event }: EventHistoryProps) => {
  return (
    <div className="flex flex-col p-6 bg-white border rounded-[14px] gap-y-8">
      <Item variant="muted" className="bg-white p-0">
        <ItemContent>
          <ItemTitle className="text-[18px]">{event.title}</ItemTitle>
          <ItemDescription>{event.description}</ItemDescription>
        </ItemContent>
        <ItemContent>
          <ItemTitle>{formatDate(event.date)}</ItemTitle>
        </ItemContent>
      </Item>

      {event.attendees.length > 0 && (
        <div>
          <h3 className="mb-4">Attendees</h3>
          {event.attendees.map((attendee) => (
            <Item key={attendee.id} variant="muted" className="bg-white p-0">
              <ItemMedia>
                <ClassAvatar user={attendee} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{attendee.name}</ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventHistory;
