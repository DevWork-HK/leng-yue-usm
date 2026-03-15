import { CLASS, POSITION } from '@/constants';
import { object, string, enum as enum_, infer as infer_, boolean } from 'zod';

export const userSchema = object({
  id: string().nonempty('ID is required.'),
  name: string().min(1, 'Name must be at least 1 character.'),
  position: enum_(
    POSITION,
    `Class must be one of the ${Object.values(POSITION).join(', ')}.`,
  ),
  active: boolean(),
  class: enum_(
    CLASS,
    `Class must be one of the ${Object.values(CLASS).join(', ')}.`,
  ),
});

export type UserType = infer_<typeof userSchema>;
