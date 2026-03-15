'use client';

import { UserType } from '@/schema/user';
import { Controller, useForm } from 'react-hook-form';
import { PencilLine } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Button } from '@/components/ui/button';
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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { CLASS, POSITION } from '@/constants';
import { getClassName, getDirtyValues } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, enum as enum_, infer as infer_ } from 'zod';

type UserProps = {
  user: UserType;
};

const editUserSchema = object({
  id: string().nonoptional(),
  name: string().min(1, 'Name must be at least 1 character.'),
  position: enum_(
    POSITION,
    `Class must be one of the ${Object.values(POSITION).join(', ')}.`,
  ).optional(),
  class: enum_(
    CLASS,
    `Class must be one of the ${Object.values(CLASS).join(', ')}.`,
  ),
});

type EditUserType = infer_<typeof editUserSchema>;

const User = ({ user }: UserProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useForm<EditUserType>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      class: user.class,
      position: user.position,
    },
  });

  const onFormSubmit = async (data: EditUserType) => {
    const changes = getDirtyValues(dirtyFields, data);

    console.log(changes);
  };

  return (
    <div className="flex flex-nowrap items-center gap-x-4 border border-zinc-300 rounded-xl bg-white">
      <Dialog
        onOpenChange={(isOpen) => {
          if (!isOpen) reset();
        }}
      >
        <Item>
          <ItemMedia>
            <Avatar size="lg">
              <AvatarImage
                src={`/images/${user.class.toLocaleUpperCase()}.jpeg`}
                className="p-1 object-cover"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{user.name}</ItemTitle>
            <ItemDescription>{getClassName(user.class)}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <DialogTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="cursor-pointer"
              >
                <PencilLine />
              </Button>
            </DialogTrigger>
          </ItemActions>
        </Item>

        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update User Information. Click &quot;Submit&quot; to save changes.
            </DialogDescription>
          </DialogHeader>

          <form
            id={`user-edit-form-${user.id}`}
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <FieldGroup>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="edit-form-name">Name</FieldLabel>
                    <Input {...field} id="edit-form-name" />
                  </Field>
                )}
              />

              <Controller
                name="class"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="edit-form-class">Class</FieldLabel>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger id="edit-form-class">
                        <SelectValue placeholder="Select a class" />
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
                name="position"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="edit-form-position">Class</FieldLabel>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger id="edit-form-position">
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {Object.entries(POSITION).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="default"
              form={`user-edit-form-${user.id}`}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default User;
