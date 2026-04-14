import { array, number, object, string, infer as _infer } from 'zod';

export const luckyDrawSchema = object({
  id: string().nonempty('ID is required.'),
  event: string().nonempty('Event name is required.'),
  createdAt: string(),
  modifiedAt: string(),
  result: array(
    object({
      name: string().min(1, 'Name must be at least 1 character.'),
      priority: number()
        .int()
        .nonnegative('Priority must be a non-negative integer.'),
      winner: array(
        string().min(1, 'Winner name must be at least 1 character.'),
      ).min(1, 'There must be at least one winner.'),
    }),
  ),
});

export type LuckyDrawType = _infer<typeof luckyDrawSchema>;
