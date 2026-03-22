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
import { Field } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { EVENT } from '@/constants';
import { CalendarPlus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const AddEvent = () => {
  const [loading, setLoading] = useState(false);
  const { control } = useForm();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-sm">
          <CalendarPlus /> Add Event
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>

        <div>
          <form id="add-event-form">
            <Controller
              name={`title`}
              control={control}
              render={({ field }) => (
                <Field className="flex-1">
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger id={``}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {Object.entries(EVENT).map(([key, value]) => (
                        <SelectItem key={key} value={value}></SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
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
