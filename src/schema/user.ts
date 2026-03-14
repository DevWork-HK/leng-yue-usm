import { CLASS } from '@/constants';
import { object, string, enum as enum_, infer as infer_ } from 'zod';

export const userSchema = object({
  id: string().nonempty('ID is required.'),
  name: string().min(1, 'Name must be at least 1 character.'),
  class: enum_(
    CLASS,
    `Class must be one of the ${Object.values(CLASS).join(', ')}.`,
  ),
});

export type UserType = infer_<typeof userSchema>;
