import * as z from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 character.'),
});

export type UserType = z.infer<typeof userSchema>;
