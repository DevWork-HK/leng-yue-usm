'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
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
import { updateMember } from '@/lib/supabase/actions';
import {
  delay,
  getClassName,
  getDirtyValues,
  getPositionName,
  toastBox,
} from '@/lib/utils';
import { MemberType } from '@/schema/member';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { object, string, enum as _enum, infer as _infer } from 'zod';

type MemberEditProps = {
  member: MemberType;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
};

const editMemberSchema = object({
  id: string().nonoptional(),
  name: string().min(1, 'Name must be at least 1 character.'),
  position: _enum(
    POSITION,
    `Position must be one of the ${Object.values(POSITION).join(', ')}.`,
  ).optional(),
  class: _enum(
    CLASS,
    `Class must be one of the ${Object.values(CLASS).join(', ')}.`,
  ),
});

type EditMemberType = _infer<typeof editMemberSchema>;

const MemberEdit = ({ member, dialogOpen, setDialogOpen }: MemberEditProps) => {
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

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(isOpen) => {
        setDialogOpen(isOpen);
        if (!isOpen) reset();
      }}
    >
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
    </Dialog>
  );
};
export default MemberEdit;
