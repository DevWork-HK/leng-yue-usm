'use client';

import { UserType } from '@/schema/user';
import { Controller, useForm } from 'react-hook-form';
import { PencilLine, SquarePlus, Trash2 } from 'lucide-react';
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { CLASS, POSITION } from '@/constants';
import {
  cn,
  delay,
  getClassName,
  getDirtyValues,
  getPositionName,
  toastBox,
} from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, enum as enum_, infer as infer_ } from 'zod';
import { useState } from 'react';
import { deleteUser, updateUser } from '@/lib/supabase/actions';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import ClassAvatar from '@/components/custom/ClassAvatar';

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

const PositionLabel = ({ position }: { position: POSITION }) => {
  switch (position) {
    case POSITION.DA_DANG_JIA:
    case POSITION.ER_DANG_JIA:
    case POSITION.SAN_DANG_JIA:
    case POSITION.SI_DANG_JIA:
    case POSITION.WU_DANG_JIA:
      return (
        <Badge className="bg-amber-200 text-white rounded-sm text-[10px]">
          {getPositionName(position)}
        </Badge>
      );
    case POSITION.RONG_YU_BANG_ZHONG:
      return (
        <Badge className="bg-green-300 text-white rounded-sm text-[10px]">
          {getPositionName(position)}
        </Badge>
      );
    case POSITION.TANG_ZHU:
      return (
        <Badge className="bg-blue-200 text-white rounded-sm text-[10px]">
          {getPositionName(position)}
        </Badge>
      );
    default:
      return (
        <Badge className="bg-zinc-300 text-white rounded-sm">
          {getPositionName(position)}
        </Badge>
      );
  }
};

const User = ({ user }: UserProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
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
    try {
      setLoading(true);
      const changes = getDirtyValues(dirtyFields, data);
      await updateUser(changes, user.id);
      router.refresh();

      await delay(1000);
      setDialogOpen(false);
      toastBox.success('User updated successfully.');
    } catch (error) {
      console.error('Unexpected error while updating user:', error);
      toastBox.error('User updated failed.');
    } finally {
      setLoading(false);
    }
  };

  const onDeleteConfirm = async () => {
    try {
      await deleteUser([user.id]);
      toastBox.success('User delete successfully.');
      router.refresh();
    } catch (error) {
      console.error('Unexpected error while deleting user:', error);
      toastBox.error('User delete failed.');
    }
  };

  const onAddUserConfirm = async () => {
    try {
      await updateUser({ active: true }, user.id);
      toastBox.success('User added successfully.');
      router.refresh();
    } catch (error) {
      console.error('Unexpected error while adding user:', error);
      toastBox.error('User added failed.');
    }
  };

  return (
    <div
      className={cn(
        'flex flex-nowrap items-center gap-x-4 border border-zinc-300 rounded-xl bg-white',
        user.active === false && 'opacity-50',
      )}
    >
      <Dialog
        open={dialogOpen}
        onOpenChange={(isOpen) => {
          setDialogOpen(isOpen);
          if (!isOpen) reset();
        }}
      >
        <AlertDialog>
          <Item>
            <ItemMedia>
              <ClassAvatar user={user} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{user.name}</ItemTitle>
              <ItemDescription>{getClassName(user.class)}</ItemDescription>
            </ItemContent>
            <ItemContent>
              <PositionLabel position={user.position} />
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
              <AlertDialogTrigger asChild>
                {user.active ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="cursor-pointer bg-white"
                  >
                    <Trash2 />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="cursor-pointer text-green-600 hover:bg-green-100 hover:text-green-600"
                  >
                    <SquarePlus />
                  </Button>
                )}
              </AlertDialogTrigger>
            </ItemActions>
          </Item>

          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update User Information. Click &quot;Submit&quot; to save
                changes.
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
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Field>
                      <FieldLabel htmlFor="edit-form-name">Name</FieldLabel>
                      <Input {...field} id="edit-form-name" />
                      {invalid && <FieldError errors={[error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="class"
                  control={control}
                  render={({ field, fieldState: { invalid, error } }) => (
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
                      {invalid && <FieldError errors={[error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="position"
                  control={control}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Field>
                      <FieldLabel htmlFor="edit-form-position">
                        Position
                      </FieldLabel>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger id="edit-form-position">
                          <SelectValue placeholder="Select a position" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {Object.entries(POSITION).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {getPositionName(value)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {invalid && <FieldError errors={[error]} />}
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
                disabled={loading}
              >
                {loading ? <Spinner /> : 'Submit'}
              </Button>
            </DialogFooter>
          </DialogContent>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={
                  user.active === true ? onDeleteConfirm : onAddUserConfirm
                }
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Dialog>
    </div>
  );
};

export default User;
