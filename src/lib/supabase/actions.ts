'use server';

import { UserType } from '@/schema/user';
import { createClient } from './server';
import { cookies } from 'next/headers';
import { TABLE_NAMES } from '@/constants/supabase';
import { EventType } from '@/schema/event';

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

  let query = supabase.from(TABLE_NAMES.MEMBER).select<'*', UserType>('*');

  if (activeOnly) {
    query = query.eq('active', true);
  }

  const { error, data } = await query;

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
    .select<'*', UserType>()
    .eq('id', id);

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

export const createEvent = async (event: Partial<EventType>) => {
  const supabase = createClient(cookies());

  const { error, data } = await supabase
    .from(TABLE_NAMES.EVENT)
    .insert(event)
    .select<'*', EventType>('*');

  if (error) {
    throw error;
  }

  return data;
};

export const getEvents = async () => {
  const supabase = createClient(cookies());

  const { error, data } = await supabase
    .from(TABLE_NAMES.EVENT)
    .select<'*', EventType>('*');

  if (error) {
    throw error;
  }

  return data;
};
