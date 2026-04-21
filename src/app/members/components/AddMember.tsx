'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { CLASS, POSITION } from '@/constants';
import { createMembers } from '@/lib/supabase/actions';
import { delay, getClassName, getPositionName, toastBox } from '@/lib/utils';
import { MemberType } from '@/schema/member';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserMinus, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  object,
  array,
  string,
  union,
  enum as enum_,
  infer as _infer,
} from 'zod';

const createMemberSchema = object({
  members: array(
    object({
      name: string().min(1, 'Name must be at least 1 character.'),
      class: union([
        enum_(
          CLASS,
          `Class must be one of the ${Object.values(CLASS).join(', ')}.`,
        ),
        string().length(0),
      ]),
      position: string().nonoptional(),
      remark: string().optional(),
    }),
  ),
});

type CreateMemberType = _infer<typeof createMemberSchema>;

const defaultMember = { name: '', class: '', position: '', remark: '' };

const AddMember = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<CreateMemberType>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: {
      members: [defaultMember],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  const onFormSubmit = async (data: CreateMemberType) => {
    try {
      setLoading(true);
      await createMembers(
        data.members.filter(
          (member) => member.name && member.class,
        ) as Partial<MemberType>[],
      );

      router.refresh();
      await delay(1000);
      setDialogOpen(false);
      toastBox.success('Member created successfully.');
      reset();
    } catch (error) {
      console.error('Unexpected error while adding member:', error);
      toastBox.error('Member creation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(isOpen) => {
        setDialogOpen(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="xl" className='border-(--xue-he-light) bg-linear-to-br from-(--xue-he-primary) to-white'>
          <UserPlus /> 增加幫眾
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-full max-w-[calc(100%-2rem)] sm:max-w-3xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>增加幫眾</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-scroll max-h-[50vh]">
          <div className="flex flex-nowrap gap-2 p-1">
            <FieldLabel className="flex-2">角色ID</FieldLabel>
            <FieldLabel className="flex-1">職業</FieldLabel>
            <FieldLabel className="flex-1">職位</FieldLabel>
            <FieldLabel className="flex-3">備註</FieldLabel>
          </div>
          <form
            id="add-member-form"
            onSubmit={handleSubmit(onFormSubmit)}
            className="p-1 flex flex-col gap-y-2"
          >
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-nowrap gap-2">
                <Controller
                  name={`members.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <Field className="flex-2">
                      <Input {...field} id={`members.${index}.name`} />
                    </Field>
                  )}
                />
                <Controller
                  name={`members.${index}.class`}
                  control={control}
                  render={({ field }) => (
                    <Field className="flex-1">
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {Object.entries(CLASS).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {getClassName(value)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name={`members.${index}.position`}
                  control={control}
                  render={({ field }) => (
                    <Field className="flex-1">
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {Object.entries(POSITION).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {getPositionName(value)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name={`members.${index}.remark`}
                  control={control}
                  render={({ field }) => (
                    <Field className="flex-3" orientation="horizontal">
                      <Input {...field} id={`members.${index}.remark`} />
                      <Button
                        onClick={() => remove(index)}
                        variant="destructive"
                      >
                        <UserMinus />
                      </Button>
                    </Field>
                  )}
                />
              </div>
            ))}
            <Button
              onClick={() => append(defaultMember)}
              variant="secondary"
              className="mt-2"
            >
              <UserPlus />
            </Button>
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
            form="add-member-form"
            disabled={loading}
          >
            {loading ? <Spinner /> : '確定'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddMember;
