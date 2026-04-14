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
import { createLuckyDraw, getEvents, getMembers } from '@/lib/supabase/actions';
import { DateTime } from 'luxon';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Controller, FieldErrors, useForm, useWatch } from 'react-hook-form';
import { cn, drawItemsFromArray, toastBox } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarFold, Trophy, Users } from 'lucide-react';
import { memberSchema, MemberType } from '@/schema/member';
import ClassAvatar from '@/components/custom/ClassAvatar';
import { ClassValue } from 'clsx';
import { object, string, infer as _infer, array, number } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

const SectionBlock = ({
  children,
  className,
}: PropsWithChildren<{ className?: ClassValue }>) => (
  <div
    className={cn(
      'px-6 py-8 border rounded-[14px] bg-white flex flex-col gap-y-6',
      className,
    )}
  >
    {children}
  </div>
);

const createLuckyDrawSchema = object({
  event: string().min(1, 'Event must be at least 1 character.'),
  eligibleMembers: memberSchema.array(),
  result: array(
    object({
      name: string().min(1, 'Name must be at least 1 character.'),
      priority: number()
        .int()
        .nonnegative('Priority must be a non-negative integer.'),
      winner: array(
        string().min(1, 'Winner name must be at least 1 character.'),
      ).min(1, 'There must be at least one winner.'),
    }),
  ),
});

type CreateLuckyDrawType = _infer<typeof createLuckyDrawSchema>;

const DrawResultItem = ({
  member,
  result,
}: {
  member: MemberType;
  result: CreateLuckyDrawType['result'][number];
}) => {
  return (
    <div
      className={cn(
        'flex gap-8 border-2 rounded-lg p-6 items-center',
        result.priority === 1
          ? 'bg-yellow-100 border-yellow-400'
          : 'bg-gray-200 border-gray-400',
      )}
    >
      <Trophy
        size={32}
        className={cn(
          result.priority === 1 ? 'text-yellow-500' : 'text-gray-600',
        )}
      />
      <div className="flex items-center gap-4">
        <ClassAvatar member={member} />
        <div>{member.name}</div>
      </div>
      <div
        className={cn(
          'ml-auto rounded-lg p-2 font-medium',
          result.priority === 1
            ? 'border-yellow-500 text-yellow-700'
            : 'border border-gray-400 text-gray-700',
        )}
      >
        {result.name}
      </div>
    </div>
  );
};

const LuckyDrawEvent = () => {
  const [loading, setLoading] = useState(false);

  const { control, setValue, reset, handleSubmit } =
    useForm<CreateLuckyDrawType>({
      resolver: zodResolver(createLuckyDrawSchema),
      defaultValues: {
        event: '',
        eligibleMembers: [],
        result: [],
      },
    });

  const selectedEvent = useWatch({
    control,
    name: 'event',
  });

  const eligibleMembers = useWatch({
    control,
    name: 'eligibleMembers',
  });

  const luckDrawResult = useWatch({
    control,
    name: 'result',
  });

  useEffect(() => {
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

    const fetchData = async () => {
      setLoading(true);

      try {
        const [members, events] = await Promise.all([
          getMembers({ activeOnly: true }),
          getEvents({
            startTime: startTime.toISO(),
            endTime: endTime.toISO(),
          }),
        ]);

        if (
          !members ||
          members.length === 0 ||
          !events ||
          events.length === 0
        ) {
          setValue('eligibleMembers', []);
          return;
        }

        const eligibleMemberIds = intersection(
          ...events.map((event) => event.attendees),
        );

        const eligibleMembers = members.filter((member) =>
          eligibleMemberIds.includes(member.id),
        );

        setValue('eligibleMembers', eligibleMembers);
      } catch (error) {
        console.error('Error fetching users or events:', error);
        toastBox.error('Failed to fetch data for the selected event');
        setValue('eligibleMembers', []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedEvent, setValue, reset]);

  const onFormSubmit = async (data: CreateLuckyDrawType) => {
    try {
      setLoading(true);
      const { drawn, remaining } = drawItemsFromArray(data.eligibleMembers, 3);

      const result = [
        {
          name: 'full-attendance bonus',
          priority: 5,
          winner: drawn.map((winner) => winner.id),
        },
      ];

      const { drawn: grandPrizeWinners } = drawItemsFromArray(remaining, 1);

      if (grandPrizeWinners.length > 0) {
        result.push({
          name: 'grand prize',
          priority: 1,
          winner: grandPrizeWinners.map((winner) => winner.id),
        });
      }

      await createLuckyDraw({
        event: data.event,
        result,
      });

      setValue('result', result);
      toastBox.success('Lucky draw created successfully');
    } catch (error) {
      console.error('Error creating lucky draw:', error);
      toastBox.error('Failed to create lucky draw');
    } finally {
      setLoading(false);
    }
  };

  const onFormError = (errors: FieldErrors) => {
    console.error('Form submission errors:', errors);
    toastBox.error(
      'Something went wrong. Please check the form and try again.',
    );
  };

  return (
    <div>
      <form
        id="lucky-draw-form"
        onSubmit={handleSubmit(onFormSubmit, onFormError)}
      >
        <SectionBlock>
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
              <Button
                type="submit"
                size="lg"
                form="lucky-draw-form"
                disabled={loading || !selectedEvent}
              >
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

                  <Field className="gap-0">
                    <FieldLabel className="text-gray-500 relative">
                      Eligible Member Count
                    </FieldLabel>
                    <div className="font-semibold text-lg">
                      {eligibleMembers?.length || 0}
                    </div>
                  </Field>
                </div>
              </div>
            </>
          )}
        </SectionBlock>
      </form>

      {eligibleMembers && eligibleMembers.length > 0 && (
        <SectionBlock className="mt-7">
          <h3 className="flex items-center gap-x-4 font-semibold text-xl">
            <Users strokeWidth={3} />
            Eligible Members ({eligibleMembers.length})
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {eligibleMembers.map((member: MemberType) => (
              <div
                key={member.id}
                className="flex gap-x-4 items-center border rounded-lg p-3"
              >
                <ClassAvatar member={member} />
                {member.name}
              </div>
            ))}
          </div>
        </SectionBlock>
      )}

      {luckDrawResult && luckDrawResult.length > 0 && (
        <SectionBlock className="mt-7 border-2 border-violet-200 bg-violet-100">
          <h3 className="flex items-center gap-x-4 font-semibold text-xl">
            <Trophy className="stroke-3 stroke-violet-600" />
            Lucky Draw Result
          </h3>
          {luckDrawResult.map((result) => {
            return result.winner.map((winnerId) => {
              const winner = eligibleMembers.find(
                (member) => member.id === winnerId,
              );
              if (!winner) return null;

              return (
                <DrawResultItem
                  key={winner.id}
                  member={winner}
                  result={result}
                />
              );
            });
          })}
        </SectionBlock>
      )}
    </div>
  );
};
export default LuckyDrawEvent;
