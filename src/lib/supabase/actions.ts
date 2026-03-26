'use server';

import { UserType } from '@/schema/user';
import { createClient } from './server';
import { cookies } from 'next/headers';
import { TABLE_NAMES } from '@/constants/supabase';
import { EventType } from '@/schema/event';
import { DateTime } from 'luxon';

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

type GetEventsOptions = {
  startTime?: DateTime;
  endTime?: DateTime;
};

export const getEvents = async (options?: GetEventsOptions) => {
  const supabase = createClient(cookies());

  const query = supabase.from(TABLE_NAMES.EVENT).select<'*', EventType>('*');

  if (options) {
    if (options.startTime) {
      query.gte('date', options.startTime.toUTC().toISO());
    }

    if (options.endTime) {
      query.lte('date', options.endTime.toUTC().toISO());
    }
  }

  const { error, data } = await query;

  if (error) {
    throw error;
  }

  return data;
};
