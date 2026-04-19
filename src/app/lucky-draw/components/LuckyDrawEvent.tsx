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
import { EVENT, FULL_MONTH_FORMAT, IANA_HK_TIME_ZONE } from '@/constants';
import { createLuckyDraw, getEvents, getMembers } from '@/lib/supabase/actions';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Controller, FieldErrors, useForm, useWatch } from 'react-hook-form';
import { drawItemsFromArray, toastBox } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarFold, Trophy, Users } from 'lucide-react';
import { memberSchema, MemberType } from '@/schema/member';
import ClassAvatar from '@/components/custom/ClassAvatar';
import { object, string, infer as _infer, array, number } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SectionBlock from './SectionBlock';
import DrawResultItem from './DrawResultItem';

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

const createLuckyDrawSchema = object({
  event: string().min(1, 'Event must be at least 1 character.'),
  eligibleMembers: memberSchema.array(),
  result: array(
    object({
      name: string().min(1, 'Name must be at least 1 character.'),
      priority: number()
        .int()
        .nonnegative('Priority must be a non-negative integer.'),
      winners: array(
        string().min(1, 'Winner name must be at least 1 character.'),
      ).min(1, 'There must be at least one winner.'),
    }),
  ),
});

export type CreateLuckyDrawType = _infer<typeof createLuckyDrawSchema>;

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
            title: EVENT.CLAN_WAR,
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
          name: '全勤獎',
          priority: 5,
          winners: drawn.map((winner) => winner.id),
        },
      ];

      const { drawn: grandPrizeWinners } = drawItemsFromArray(remaining, 1);

      if (grandPrizeWinners.length > 0) {
        result.unshift({
          name: '680自選',
          priority: 1,
          winners: grandPrizeWinners.map((winner) => winner.id),
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
                  <FieldLabel>選擇月份</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger size="lg">
                      <SelectValue placeholder="選擇月份" />
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
                className="border-(--tie-yi-light) bg-linear-to-br from-(--tie-yi-primary) via-(--tie-yi-light) to-white"
                form="lucky-draw-form"
                disabled={
                  loading || !selectedEvent || eligibleMembers.length === 0
                }
              >
                進行抽獎
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
                      已選擇月份
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
                      合格成員數
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
            合格成員 ({eligibleMembers.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {eligibleMembers.map((member: MemberType) => (
              <div
                key={member.id}
                className="flex gap-x-4 items-center border rounded-lg p-3 relative"
              >
                <ClassAvatar
                  memberClass={member.class}
                  fallbackText={member.name}
                />
                {member.name}
                <Button
                  variant="outline"
                  size="icon-xs"
                  className="border-none p-0 ml-auto absolute top-0 right-0 translate-x-1/2 translate-y-[-50%] bg-zinc-100 rounded-full"
                  onClick={() => {
                    const updatedMembers = eligibleMembers.filter(
                      (m) => m.id !== member.id,
                    );
                    setValue('eligibleMembers', updatedMembers);
                  }}
                >
                  &times;
                </Button>
              </div>
            ))}
          </div>
        </SectionBlock>
      )}

      {luckDrawResult && luckDrawResult.length > 0 && (
        <SectionBlock className="mt-7 border-2 border-violet-200 bg-violet-100">
          <h3 className="flex items-center gap-x-4 font-semibold text-xl">
            <Trophy className="stroke-3 stroke-violet-600" />
            抽獎結果
          </h3>
          {luckDrawResult.map((result) => {
            return result.winners.map((winnerId) => {
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
