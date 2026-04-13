'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { intersection } from 'lodash';
import { FULL_MONTH_FORMAT, IANA_HK_TIME_ZONE } from '@/constants';
import { getEvents, getUsers } from '@/lib/supabase/actions';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toastBox } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarFold, Eye, Users } from 'lucide-react';

const currentDate = DateTime.local({ zone: IANA_HK_TIME_ZONE }).startOf(
  'month',
);

const eventOptions = Array.from({ length: 6 }).map((_, index) => {
  const month = currentDate.plus({ months: -index });
  return {
    value: month.setLocale('en').toFormat(FULL_MONTH_FORMAT),
    label: month.setLocale('en').toFormat(FULL_MONTH_FORMAT),
  };
});

const LuckyDrawEvent = () => {
  const { control, setValue } = useForm();

  const selectedEvent = useWatch({
    control,
    name: 'event',
  });

  useEffect(() => {
    console.log('Selected event changed:', selectedEvent);
    if (!selectedEvent) return;

    const startTime = DateTime.fromFormat(selectedEvent, FULL_MONTH_FORMAT, {
      zone: IANA_HK_TIME_ZONE,
    }).startOf('month');
    const endTime = DateTime.fromFormat(selectedEvent, FULL_MONTH_FORMAT, {
      zone: IANA_HK_TIME_ZONE,
    }).endOf('month');

    if (!startTime.isValid || !endTime.isValid) {
      toastBox.error('Invalid date format for selected event');
      return;
    }

    Promise.all([
      getUsers({ activeOnly: true }),
      getEvents({
        startTime: startTime.toISO(),
        endTime: endTime.toISO(),
      }),
    ])
      .then(([users, events]) => {
        if (!users || users.length === 0) {
          setValue('eligibleUserCount', 0);
          return;
        }

        if ((!events || events.length === 0) && users.length > 0) {
          setValue('eligibleUserCount', users.length);
          return;
        }

        const eligibleUserIds = intersection(
          ...events.map((event) => event.attendees),
        );

        const eligibleUsers = users.filter((user) =>
          eligibleUserIds.includes(user.id),
        );

        setValue('eligibleUserCount', eligibleUsers.length);
      })
      .catch((error) => {
        console.error('Error fetching users or events:', error);
        toastBox.error('Failed to fetch data for the selected event');
      });
  }, [selectedEvent, setValue]);

  return (
    <div className="px-6 py-8 border rounded-[14px] bg-white">
      <form className="flex flex-col gap-4">
        <div className="flex gap-x-2">
          <Controller
            name="event"
            control={control}
            render={({ field }) => (
              <Field className="flex-1">
                <FieldLabel>Select Month</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger size="lg">
                    <SelectValue placeholder="Choose a month" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {eventOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Field className="flex-1">
            <FieldLabel>&nbsp;</FieldLabel>
            <Button type="button" size="lg">
              Run Lucky Draw
            </Button>
          </Field>
        </div>

        {selectedEvent && (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-x-4">
                <Avatar size="lg" className="after:border-none">
                  <AvatarFallback className="rounded-[8px] bg-blue-100">
                    <CalendarFold className="stroke-blue-500" />
                  </AvatarFallback>
                </Avatar>
                <Field className="gap-0">
                  <FieldLabel className="text-gray-500">
                    Selected Month
                  </FieldLabel>
                  <div className="font-semibold text-lg">{selectedEvent}</div>
                </Field>
              </div>
              <div className="flex items-center gap-x-4">
                <Avatar size="lg" className="after:border-none">
                  <AvatarFallback className="rounded-[8px] bg-green-100">
                    <Users className="stroke-green-500" />
                  </AvatarFallback>
                </Avatar>
                <Controller
                  name="eligibleUserCount"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-0">
                      <FieldLabel className="text-gray-500">
                        Eligible User Count
                        <Button variant="ghost" size="icon" type='button'>
                          <Eye />
                        </Button>
                      </FieldLabel>
                      <div className="font-semibold text-lg">{field.value}</div>
                    </Field>
                  )}
                />
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
export default LuckyDrawEvent;
