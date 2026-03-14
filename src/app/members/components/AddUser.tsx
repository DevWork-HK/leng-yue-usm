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
import { CLASS } from '@/constants';
import { createClient } from '@/lib/supabase/client';
import { getClassName } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserMinus, UserPlus } from 'lucide-react';
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
      remark: string().optional(),
    }),
  ),
});

type CreateUserType = infer_<typeof createUserSchema>;

const AddUser = () => {
  const { control, handleSubmit, reset } = useForm<CreateUserType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      members: [{ name: '', class: '', remark: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  const onFormSubmit = async (data: CreateUserType) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('Member')
        .insert(data.members.filter((member) => member.name && member.class));

      if (error) {
        console.error('Error inserting data:', error);
      } else {
        console.log('Data inserted successfully');
        reset();
      }
    } catch (error) {
      console.error('Expected error while adding user:', error);
    }
  };

  return (
    <Dialog
      onOpenChange={(isOpen) => {
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

        <div>
          <div className="grid grid-cols-6 gap-2 mb-1.5">
            <FieldLabel className="col-span-2">Name</FieldLabel>
            <FieldLabel>Class</FieldLabel>
            <FieldLabel className="col-span-3">Remark</FieldLabel>
          </div>
          <form id="add-user-form" onSubmit={handleSubmit(onFormSubmit)}>
            <FieldGroup>
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-6 gap-2">
                  <Controller
                    name={`members.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <Field className="col-span-2">
                        <Input {...field} id={`members.${index}.name`} />
                      </Field>
                    )}
                  />
                  <Controller
                    name={`members.${index}.class`}
                    control={control}
                    render={({ field }) => (
                      <Field>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger id={`members.${index}.class`}>
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
                    name={`members.${index}.remark`}
                    control={control}
                    render={({ field }) => (
                      <Field className="col-span-3" orientation="horizontal">
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
              onClick={() => append({ name: '', class: '', remark: '' })}
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
          <Button type="submit" variant="default" form="add-user-form">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddUser;
