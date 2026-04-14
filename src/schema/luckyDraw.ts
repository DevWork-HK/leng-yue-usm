import { array, number, object, string, infer as _infer } from 'zod';
import { MemberType } from './member';

const resultSchema = array(
  object({
    name: string().min(1, 'Name must be at least 1 character.'),
    priority: number()
      .int()
      .nonnegative('Priority must be a non-negative integer.'),
    winners: array(
      string().min(1, 'Winner name must be at least 1 character.'),
    ).min(1, 'There must be at least one winner.'),
  }),
);

export type ResultType = _infer<typeof resultSchema>[number];

export const luckyDrawSchema = object({
  id: string().nonempty('ID is required.'),
  event: string().nonempty('Event name is required.'),
  createdAt: string(),
  modifiedAt: string(),
  result: resultSchema,
});

export type LuckyDrawType = _infer<typeof luckyDrawSchema>;
export type DetailedLuckyDrawType = Omit<LuckyDrawType, 'result'> & {
  result: (Omit<ResultType, 'winners'> & { winners: MemberType[] })[];
};
