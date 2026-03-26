import { object, string, infer as _infer } from 'zod';
import { UserType } from './user';

export const eventSchema = object({
  id: string().nonempty('ID is required.'),
  title: string().min(1, 'Event must be at least 1 character.'),
  date: string().nonempty('Date is required.'),
  description: string().optional(),
  attendees: string().array(),
  created_at: string(),
  modified_at: string(),
});

export type EventType = _infer<typeof eventSchema>;
export type DetailedEventType = Omit<EventType, 'attendees'> & {
  attendees: UserType[];
};
