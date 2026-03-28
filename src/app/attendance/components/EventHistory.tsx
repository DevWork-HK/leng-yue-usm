'use client';

import ClassAvatar from '@/components/custom/ClassAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { formatDate } from '@/lib/utils';
import { DetailedEventType } from '@/schema/event';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type EventHistoryProps = {
  event: DetailedEventType;
};

const EventHistory = ({ event }: EventHistoryProps) => {
  const [displayAttendees, setDisplayAttendees] = useState(
    event.attendees.slice(0, 3),
  );

  const toggleAttendees = () => {
    if (displayAttendees.length === 3) {
      setDisplayAttendees(event.attendees);
    } else {
      setDisplayAttendees(event.attendees.slice(0, 3));
    }
  };

  return (
    <div className="flex flex-col p-6 bg-white border rounded-[14px] gap-y-4">
      <Item variant="muted" className="bg-white p-0">
        <ItemContent>
          <ItemTitle className="text-[18px]">{event.title}</ItemTitle>
          <ItemDescription>{formatDate(event.date)}</ItemDescription>
        </ItemContent>
        <ItemContent className="items-end gap-2">
          <Badge className="bg-blue-100 border-blue-200 text-blue-400 flex-1 w-full flex text-center">
            {event.totalCount} Total
          </Badge>
          <Badge className="bg-green-100 text-green-700 flex-1 w-full border-green-200">
            {event.attendCount} Joined
          </Badge>
        </ItemContent>
      </Item>

      {event.attendees.length > 0 && (
        <div>
          <h3 className="mb-2">Attendees</h3>
          <div className="flex flex-col gap-y-2">
            {displayAttendees.map((attendee) => (
              <Item key={attendee.id} variant="muted" className="bg-white p-0">
                <ItemMedia>
                  <ClassAvatar user={attendee} size="sm" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{attendee.name}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </div>

          {event.attendees.length > 3 && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={toggleAttendees}
            >
              <ChevronDown
                className={
                  displayAttendees.length === 3 ? 'rotate-0' : 'rotate-180'
                }
              />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventHistory;
