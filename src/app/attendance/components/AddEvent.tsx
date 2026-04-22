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
import { createEvent, getMembers } from '@/lib/supabase/actions';
import { delay, formatDate, getEventName, toastBox } from '@/lib/utils';
import { MemberType } from '@/schema/member';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays, CalendarPlus, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { infer as _infer, object, string } from 'zod';
import { zhHK } from 'react-day-picker/locale';
import { API } from '@/constants/apis';
import { ClanWarExcelResponseType } from '@/schema/event';
import { Textarea } from '@/components/ui/textarea';

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
  const [memberLoading, setMemberLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeMembers, setActiveMembers] = useState<MemberType[]>([]);
  const [notFoundNames, setNotFoundNames] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { control, handleSubmit, reset, setValue } = useForm<CreateEventType>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      date: '',
      description: '',
      attendees: [],
    },
  });

  useEffect(() => {
    getMembers({ activeOnly: true })
      .then((members) => {
        setActiveMembers(members);
      })
      .finally(() => {
        setMemberLoading(false);
      });
  }, []);

  const onFormSubmit = async (data: CreateEventType) => {
    try {
      setLoading(true);

      const eventData = {
        ...data,
        ...(data.title.includes(TITLE_SEPARATOR) && {
          title: data.title.split(TITLE_SEPARATOR)[1],
        }),
        totalCount: activeMembers.length,
      };

      await createEvent(eventData);

      router.refresh();
      await delay(1000);
      setDialogOpen(false);
      toastBox.success('Event created successfully.');
      reset();
    } catch (error) {
      console.error('Unexpected error while creating event:', error);
      toastBox.error('Event creation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      toastBox.error('No file selected.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(API.VALID_ATTENDEES, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result: ClanWarExcelResponseType = await response.json();

        if (result) {
          const validAttendeeNames = result.validMembers;

          const [foundIds, notFoundNames] = validAttendeeNames.reduce(
            (acc, name) => {
              const member = activeMembers.find((m) => m.name === name);
              if (member) {
                acc[0].push(member.id);
              } else {
                acc[1].push(name);
              }
              return acc;
            },
            [[], []] as string[][],
          );

          setNotFoundNames(notFoundNames);

          setValue('attendees', foundIds);
          setValue('title', EVENT.CLAN_WAR);

          toastBox.success('File processed successfully.');
        } else {
          toastBox.error('No valid attendees found in the file.');
        }
      } else {
        toastBox.error('File processing failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toastBox.error('File processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(isOpen) => {
        setDialogOpen(isOpen);
        if (!isOpen) {
          reset();
          setNotFoundNames([]);
          if (fileRef.current) {
            fileRef.current.value = '';
          }
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="xl"
          className="border-chart-1 bg-linear-to-br from-chart-2 to-white"
        >
          <CalendarPlus /> 建立活動
        </Button>
      </DialogTrigger>

      <DialogContent
        className="w-full sm:w-fit sm:min-w-lg max-w-[calc(100%-2rem)] sm:max-w-2xl"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center gap-4 justify-between">
          <div className="space-y-2">
            <DialogTitle>建立活動</DialogTitle>
            <DialogDescription>記錄一個活動。</DialogDescription>
          </div>
          <Button
            size="icon"
            type="button"
            disabled={loading}
            onClick={() => fileRef.current?.click()}
          >
            <Input
              type="file"
              ref={fileRef}
              className="hidden"
              accept=".csv"
              onChange={handleFileUpload}
            />
            {loading ? <Spinner /> : <Upload />}
          </Button>
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
                        <FieldLabel>活動</FieldLabel>
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
                          <FieldLabel>請說明</FieldLabel>
                          <Input
                            value={field.value?.split(TITLE_SEPARATOR)[1] || ''}
                            onChange={(e) =>
                              field.onChange(
                                `${field.value?.split(TITLE_SEPARATOR)[0] || ''}${TITLE_SEPARATOR}${e.target.value}`,
                              )
                            }
                            placeholder="備註"
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
                    <FieldLabel>描述</FieldLabel>
                    <Input {...field} placeholder="描述" />
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
                      日期
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
                            <span className="text-zinc-500">選擇日期</span>
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

              {notFoundNames.length > 0 && (
                <Field data-invalid>
                  <FieldLabel>Excel 未找到的成員</FieldLabel>
                  <Textarea
                    value={notFoundNames.join(', ')}
                    readOnly
                    aria-invalid="true"
                  />
                </Field>
              )}

              <Controller
                name="attendees"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Field className="flex-1">
                    <FieldLabel>成員</FieldLabel>
                    <MultiSelect
                      values={field.value}
                      onValuesChange={field.onChange}
                    >
                      <MultiSelectTrigger>
                        <MultiSelectValue overflowBehavior="cutoff" />
                      </MultiSelectTrigger>
                      <MultiSelectContent
                        search={{
                          emptyMessage: '未找到成員',
                          placeholder: '輸入以搜尋',
                        }}
                      >
                        {memberLoading ? (
                          <Spinner />
                        ) : (
                          activeMembers.map((member) => (
                            <MultiSelectItem key={member.id} value={member.id}>
                              {member.name}
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
              取消
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="default"
            form="add-event-form"
            disabled={loading}
          >
            {loading ? <Spinner /> : '建立活動'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEvent;
