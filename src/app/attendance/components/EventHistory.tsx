'use client';

import ClassAvatar from '@/components/custom/ClassAvatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Kbd } from '@/components/ui/kbd';
import { EVENT } from '@/constants';
import { deleteEvent } from '@/lib/supabase/actions';
import { formatDate, getEventName, toastBox } from '@/lib/utils';
import { DetailedEventType } from '@/schema/event';
import { ChevronDown, SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type EventHistoryProps = {
  event: DetailedEventType;
};

const DEFAULT_SHOW_NUMBER = 12;

const EventHistory = ({ event }: EventHistoryProps) => {
  const [showMore, setShowMore] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [displayAttendees, setDisplayAttendees] = useState(
    event.attendees.slice(0, DEFAULT_SHOW_NUMBER),
  );

  const router = useRouter();

  const updateDiplayAttendees = (
    searchText: string = '',
    showMoreMembers: boolean = false,
  ) => {
    setShowMore(showMoreMembers);
    setSearchText(searchText);

    if (searchText) {
      setDisplayAttendees(
        event.attendees.filter((member) => member.name.includes(searchText)),
      );
    } else {
      if (showMoreMembers) {
        setDisplayAttendees(event.attendees);
      } else {
        setDisplayAttendees(event.attendees.slice(0, DEFAULT_SHOW_NUMBER));
      }
    }
  };

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const name = target.value;

      updateDiplayAttendees(name);
    }
  };

  const onDeleteConfirm = async () => {
    try {
      await deleteEvent([event.id]);
      toastBox.success('Event deleted successfully.');
      router.refresh();
    } catch (error) {
      console.error('Unexpected error while deleting event:', error);
      toastBox.error('Event delete failed.');
    }
  };

  return (
    <AlertDialog>
      <div className="flex flex-col p-6 bg-white border rounded-[14px] gap-y-4">
        <Item variant="muted" className="bg-white p-0">
          <ItemContent>
            <ItemTitle className="text-[18px]">
              {getEventName(event.title as EVENT)}
            </ItemTitle>
            <ItemDescription>{formatDate(event.date)}</ItemDescription>
          </ItemContent>
          <ItemContent className="items-end gap-2">
            <Badge className="bg-blue-100 border-blue-200 text-blue-400 flex-1 w-full flex text-center">
              {event.totalCount} 總人數
            </Badge>
            <Badge className="bg-green-100 text-green-700 flex-1 w-full border-green-200">
              {event.attendCount} 已參加
            </Badge>
          </ItemContent>
          <ItemContent className="items-end gap-2 self-stretch">
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="h-full">
                刪除活動
              </Button>
            </AlertDialogTrigger>
          </ItemContent>
        </Item>

        {event.attendees.length > 0 && (
          <div className="flex flex-col gap-y-4">
            <h3>參加者</h3>
            <InputGroup className="bg-white">
              <InputGroupInput
                id={`inline-start-input-${event.id}`}
                placeholder="搜尋..."
                onKeyDownCapture={handleKeyDownSearch}
              />
              <InputGroupAddon align="inline-start">
                <SearchIcon className="text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Kbd>按Enter搜尋</Kbd>
              </InputGroupAddon>
            </InputGroup>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {displayAttendees.map((attendee) => (
                <Item key={attendee.id} variant="outline" className="bg-white">
                  <ItemMedia>
                    <ClassAvatar
                      memberClass={attendee.class}
                      fallbackText={attendee.name}
                      size="sm"
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{attendee.name}</ItemTitle>
                  </ItemContent>
                </Item>
              ))}
            </div>

            {event.attendees.length > DEFAULT_SHOW_NUMBER && !searchText && (
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  updateDiplayAttendees('', !showMore);
                }}
              >
                <ChevronDown
                  className={!showMore ? 'rotate-0' : 'rotate-180'}
                />
              </Button>
            )}
          </div>
        )}
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>您確定要執行此操作嗎？</AlertDialogTitle>
          <AlertDialogDescription>
            正在刪除活動 - {getEventName(event.title as EVENT)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteConfirm}>確定</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EventHistory;
