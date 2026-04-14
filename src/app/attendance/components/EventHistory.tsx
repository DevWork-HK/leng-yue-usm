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
import { EVENT } from '@/constants';
import { formatDate, getEventName } from '@/lib/utils';
import { DetailedEventType } from '@/schema/event';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type EventHistoryProps = {
  event: DetailedEventType;
};

const DEFAULT_SHOW_NUMBER = 12;

const EventHistory = ({ event }: EventHistoryProps) => {
  const [displayAttendees, setDisplayAttendees] = useState(
    event.attendees.slice(0, DEFAULT_SHOW_NUMBER),
  );

  const toggleAttendees = () => {
    if (displayAttendees.length === DEFAULT_SHOW_NUMBER) {
      setDisplayAttendees(event.attendees);
    } else {
      setDisplayAttendees(event.attendees.slice(0, DEFAULT_SHOW_NUMBER));
    }
  };

  return (
    <div className="flex flex-col p-6 bg-white border rounded-[14px] gap-y-4">
      <Item variant="muted" className="bg-white p-0">
        <ItemContent>
          <ItemTitle className="text-[18px]">
            {getEventName(event.title as EVENT) || event.title}
          </ItemTitle>
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
          <div className="grid grid-cols-4 gap-2">
            {displayAttendees.map((attendee) => (
              <Item key={attendee.id} variant="outline" className="bg-white">
                <ItemMedia>
                  <ClassAvatar member={attendee} size="sm" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{attendee.name}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </div>

          {event.attendees.length > DEFAULT_SHOW_NUMBER && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={toggleAttendees}
            >
              <ChevronDown
                className={
                  displayAttendees.length === DEFAULT_SHOW_NUMBER
                    ? 'rotate-0'
                    : 'rotate-180'
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
