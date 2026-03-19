'use server';

import { createClient } from '@/lib/supabase/client';
import { UserType } from '@/schema/user';

export const updateUser = async (changes: Partial<UserType>, id: string) => {
  const supabase = createClient();

  const { error, data } = await supabase
    .from('Member')
    .update(changes)
    .eq('id', id)
    .select<'*', UserType>();

  if (error) {
    throw error;
  }

  return data;
};
