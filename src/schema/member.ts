import { CLASS, POSITION } from '@/constants';
import { object, string, enum as _enum, infer as _infer, boolean } from 'zod';

export const memberSchema = object({
  id: string().nonempty('ID is required.'),
  name: string().min(1, 'Name must be at least 1 character.'),
  createdAt: string(),
  modifiedAt: string(),
  active: boolean(),
  position: _enum(POSITION).nonoptional(),
  class: _enum(CLASS),
});

export type MemberType = _infer<typeof memberSchema>;
