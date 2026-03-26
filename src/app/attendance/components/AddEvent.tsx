'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { EVENT } from '@/constants';
import { createEvent, getUsers } from '@/lib/supabase/actions';
import { delay, formatDate, getEventName, toastBox } from '@/lib/utils';
import { UserType } from '@/schema/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays, CalendarPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { infer as _infer, object, string } from 'zod';
import { zhHK } from 'react-day-picker/locale';

const TITLE_SEPARATOR = '-';

const eventOptions = Object.values(EVENT).map((event) => ({
  value: event.toString(),
  label: getEventName(event),
}));

const createEventSchema = object({
  title: string().min(1, 'Event must be at least 1 character.'),
  date: string().nonempty('Date is required.'),
  description: string().optional(),
  attendees: string()
    .array()
    .refine(
      (items) => {
        if (!items) return true;
        return new Set(items).size === items?.length;
      },
      { message: 'Items should be unique' },
    ),
});

type CreateEventType = _infer<typeof createEventSchema>;

const AddEvent = () => {
  const [userLoading, setUserLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeUsers, setActiveUsers] = useState<UserType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<CreateEventType>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      date: '',
      description: '',
      attendees: [],
    },
  });

  const onFormSubmit = async (data: CreateEventType) => {
    try {
      setLoading(true);

      const eventData = {
        ...data,
        ...(data.title.includes(TITLE_SEPARATOR) && {
          title: data.title.split(TITLE_SEPARATOR)[1],
        }),
        attendanceRate: Number(
          (data.attendees.length / activeUsers.length).toFixed(2),
        ),
      };

      await createEvent(eventData);

      router.refresh();
      await delay(1000);
      setDialogOpen(false);
      toastBox.success('Event created successfully.');
      reset();
    } catch (error) {
      console.error('Unexpected error while creating event:', error);
      toastBox.error('Event created failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers({ activeOnly: true })
      .then((users) => {
        setActiveUsers(users);
      })
      .finally(() => {
        setUserLoading(false);
      });
  }, []);

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(isOpen) => {
        setDialogOpen(isOpen);
        if (!isOpen) {
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="text-sm">
          <CalendarPlus /> Add Event
        </Button>
      </DialogTrigger>

      <DialogContent
        className="w-full sm:w-fit sm:min-w-lg max-w-[calc(100%-2rem)] sm:max-w-2xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription>Record an event.</DialogDescription>
        </DialogHeader>

        <div>
          <form id="add-event-form" onSubmit={handleSubmit(onFormSubmit)}>
            <FieldGroup>
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <div className="flex flex-nowrap gap-2">
                      <Field className="flex-1">
                        <FieldLabel>Event</FieldLabel>
                        <Select
                          value={field.value?.split(TITLE_SEPARATOR)[0] || ''}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
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
                      {field.value?.split(TITLE_SEPARATOR)[0] ===
                        EVENT.OTHER && (
                        <Field className="flex-1">
                          <FieldLabel>Please Specify</FieldLabel>
                          <Input
                            value={field.value?.split(TITLE_SEPARATOR)[1] || ''}
                            onChange={(e) =>
                              field.onChange(
                                `${field.value?.split(TITLE_SEPARATOR)[0] || ''}${TITLE_SEPARATOR}${e.target.value}`,
                              )
                            }
                            placeholder="Remark"
                          />
                        </Field>
                      )}
                    </div>
                    {error && (
                      <FieldError className="text-sm text-red-500">
                        {error.message}
                      </FieldError>
                    )}
                  </div>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Input {...field} placeholder="Description" />
                    {error && (
                      <FieldError className="text-sm text-red-500">
                        {error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Field>
                    <FieldLabel htmlFor="add-event-date-picker">
                      Date
                    </FieldLabel>
                    <Popover
                      open={datePickerOpen}
                      onOpenChange={setDatePickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-between"
                          id="add-event-date-picker"
                        >
                          {field.value ? (
                            formatDate(field.value)
                          ) : (
                            <span className="text-zinc-500">Pick a date</span>
                          )}
                          <CalendarDays />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto" align="start">
                        <Calendar
                          locale={zhHK}
                          required
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date: Date) => {
                            field.onChange(date?.toISOString() || '');
                            setDatePickerOpen(false);
                          }}
                          defaultMonth={
                            field.value ? new Date(field.value) : undefined
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    {error && (
                      <FieldError className="text-sm text-red-500">
                        {error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="attendees"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Field className="flex-1">
                    <FieldLabel>Members</FieldLabel>
                    <MultiSelect
                      values={field.value}
                      onValuesChange={field.onChange}
                    >
                      <MultiSelectTrigger>
                        <MultiSelectValue overflowBehavior="cutoff" />
                      </MultiSelectTrigger>
                      <MultiSelectContent
                        search={{
                          emptyMessage: 'No users found.',
                          placeholder: 'Type to search',
                        }}
                      >
                        {userLoading ? (
                          <Spinner />
                        ) : (
                          activeUsers.map((user) => (
                            <MultiSelectItem key={user.id} value={user.id}>
                              {user.name}
                            </MultiSelectItem>
                          ))
                        )}
                      </MultiSelectContent>
                    </MultiSelect>

                    {error && (
                      <FieldError className="text-sm text-red-500">
                        {error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="default"
            form="add-event-form"
            disabled={loading}
          >
            {loading ? <Spinner /> : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEvent;
