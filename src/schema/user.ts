import { CLASS } from "@/constants";
import * as z from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character."),
  class: z.enum(
    CLASS,
    `Class must be one of the ${Object.values(CLASS).join(", ")}.`,
  ),
});

export type UserType = z.infer<typeof userSchema>;
