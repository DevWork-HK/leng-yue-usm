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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
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
import { createUsers } from '@/lib/supabase/actions';
import { delay, getClassName, getPositionName, toastBox } from '@/lib/utils';
import { UserType } from '@/schema/user';
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
  infer as infer_,
} from 'zod';

const createUserSchema = object({
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

type CreateUserType = infer_<typeof createUserSchema>;

const AddUser = () => {
  const defaultMember = { name: '', class: '', position: '', remark: '' };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<CreateUserType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      members: [defaultMember],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  const onFormSubmit = async (data: CreateUserType) => {
    try {
      setLoading(true);
      await createUsers(
        data.members.filter(
          (member) => member.name && member.class,
        ) as Partial<UserType>[],
      );

      router.refresh();
      await delay(1000);
      setDialogOpen(false);
      toastBox.success('User created successfully.');
      reset();
    } catch (error) {
      console.error('Unexpected error while adding user:', error);
      toastBox.error('User created failed.');
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
        <Button className="text-sm">
          <UserPlus /> Add User
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-full max-w-[calc(100%-2rem)] sm:max-w-2xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-scroll max-h-[50vh]">
          <div className="flex flex-nowrap gap-2">
            <FieldLabel className="flex-2">Name</FieldLabel>
            <FieldLabel className="flex-1">Class</FieldLabel>
            <FieldLabel className="flex-1">Position</FieldLabel>
            <FieldLabel className="flex-3">Remark</FieldLabel>
          </div>
          <form id="add-user-form" onSubmit={handleSubmit(onFormSubmit)}>
            <FieldGroup>
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
                          <SelectTrigger id={`members.${index}.position`}>
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
            </FieldGroup>
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
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="default"
            form="add-user-form"
            disabled={loading}
          >
            {loading ? <Spinner /> : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddUser;
