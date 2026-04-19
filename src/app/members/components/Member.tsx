'use client';

import { MemberType } from '@/schema/member';
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
import { deleteMember, updateMember } from '@/lib/supabase/actions';
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

type MemberProps = {
  member: MemberType;
};

const editMemberSchema = object({
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

type EditMemberType = infer_<typeof editMemberSchema>;

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

const Member = ({ member }: MemberProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useForm<EditMemberType>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      id: member.id,
      name: member.name,
      class: member.class,
      position: member.position,
    },
  });

  const onFormSubmit = async (data: EditMemberType) => {
    try {
      setLoading(true);
      const changes = getDirtyValues(dirtyFields, data);
      await updateMember(changes, member.id);
      router.refresh();

      await delay(1000);
      setDialogOpen(false);
      toastBox.success('Member updated successfully.');
    } catch (error) {
      console.error('Unexpected error while updating member:', error);
      toastBox.error('Member update failed.');
    } finally {
      setLoading(false);
    }
  };

  const onDeleteConfirm = async () => {
    try {
      await deleteMember([member.id]);
      toastBox.success('Member deleted successfully.');
      router.refresh();
    } catch (error) {
      console.error('Unexpected error while deleting member:', error);
      toastBox.error('Member delete failed.');
    }
  };

  const onAddMemberConfirm = async () => {
    try {
      await updateMember({ active: true }, member.id);
      toastBox.success('Member added successfully.');
      router.refresh();
    } catch (error) {
      console.error('Unexpected error while adding member:', error);
      toastBox.error('Member added failed.');
    }
  };

  return (
    <div
      className={cn(
        'flex flex-nowrap items-center gap-x-4 border border-zinc-300 rounded-xl bg-white',
        member.active === false && 'opacity-50',
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
              <ClassAvatar
                memberClass={member.class}
                fallbackText={member.name}
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{member.name}</ItemTitle>
              <ItemDescription>{getClassName(member.class)}</ItemDescription>
            </ItemContent>
            <ItemContent>
              <PositionLabel position={member.position} />
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
                {member.active ? (
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
              <DialogTitle>更新幫眾資料</DialogTitle>
              <DialogDescription>
                更新幫眾資料。點擊「確定」以保存更改。
              </DialogDescription>
            </DialogHeader>

            <form
              id={`member-edit-form-${member.id}`}
              onSubmit={handleSubmit(onFormSubmit)}
            >
              <FieldGroup>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Field>
                      <FieldLabel htmlFor="edit-form-name">角色ID</FieldLabel>
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
                      <FieldLabel htmlFor="edit-form-class">職業</FieldLabel>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger id="edit-form-class">
                          <SelectValue placeholder="選擇職業" />
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
                      <FieldLabel htmlFor="edit-form-position">職位</FieldLabel>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger id="edit-form-position">
                          <SelectValue placeholder="選擇職位" />
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
                  取消
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="default"
                form={`member-edit-form-${member.id}`}
                disabled={loading}
              >
                {loading ? <Spinner /> : '確定'}
              </Button>
            </DialogFooter>
          </DialogContent>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>您確定要執行此操作嗎？</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={
                  member.active === true ? onDeleteConfirm : onAddMemberConfirm
                }
              >
                確定
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Dialog>
    </div>
  );
};

export default Member;
