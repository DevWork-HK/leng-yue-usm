'use server';

import { UserType } from '@/schema/user';
import { createClient } from './server';
import { cookies } from 'next/headers';
import { TABLE_NAMES } from '@/constants/supabase';

type GetUserOptions = {
  activeOnly?: boolean;
};

export const createUsers = async (users: Partial<UserType>[]) => {
  const supabase = createClient(cookies());

  const { error, data } = await supabase
    .from(TABLE_NAMES.MEMBER)
    .insert(users)
    .select<'*', UserType>('*');

  if (error) {
    throw error;
  }

  return data;
};

export const getUsers = async (options: GetUserOptions = {}) => {
  const supabase = createClient(cookies());

  const { activeOnly } = options;

  const { error, data } = await supabase
    .from(TABLE_NAMES.MEMBER)
    .select<'*', UserType>('*')
    .eq('active', activeOnly ? true : undefined);

  if (error) {
    throw error;
  }

  return data;
};

export const updateUser = async (changes: Partial<UserType>, id: string) => {
  const supabase = createClient(cookies());

  const { error, data } = await supabase
    .from(TABLE_NAMES.MEMBER)
    .update(changes)
    .eq('id', id)
    .select<'*', UserType>();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteUser = async (ids: string[]) => {
  const supabase = createClient(cookies());

  const { error, data } = await supabase
    .from(TABLE_NAMES.MEMBER)
    .update({ active: false })
    .in('id', ids);

  if (error) {
    throw error;
  }

  return data;
};
