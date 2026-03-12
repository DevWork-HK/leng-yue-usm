'use client';

import { UserType } from '@/schema/user';
import { Controller, useForm } from 'react-hook-form';
import { PencilLine } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
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
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { CLASS } from '@/constants';
import { getClassName } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type UserProps = {
  user: UserType;
};

const User = ({ user }: UserProps) => {
  const form = useForm<UserType>({
    defaultValues: {
      id: user.id,
      name: user.name,
      class: user.class,
    },
  });

  const onFormSubmit = async (data: UserType) => {
    console.log(data);
  };

  return (
    <div className="flex flex-nowrap items-center gap-x-4 border border-zinc-300 rounded-xl">
      <Dialog>
        <Item>
          <Avatar size="lg">
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <ItemContent>
            <ItemTitle>Name</ItemTitle>
            <ItemDescription>User Email</ItemDescription>
          </ItemContent>
          <ItemActions>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="cursor-pointer">
                <PencilLine />
              </Button>
            </DialogTrigger>
          </ItemActions>
        </Item>

        <form id="user-edit-form" onSubmit={form.handleSubmit(onFormSubmit)}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update User Information. Click &quot;Submit&quot; to save
                changes.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <Label htmlFor="edit-form-name">Name</Label>
                    <Input {...field} id="edit-form-name" />
                  </Field>
                )}
              />

              <Controller
                name="class"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <Label htmlFor="edit-form-class">Class</Label>
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
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="default" form="user-edit-form">
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default User;
