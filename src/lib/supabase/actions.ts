'use server';

import { MemberType } from '@/schema/member';
import { createClient } from './server';
import { cookies } from 'next/headers';
import { TABLE_NAMES } from '@/constants/supabase';
import { EventType } from '@/schema/event';
import { DateTime } from 'luxon';
import { LuckyDrawType } from '@/schema/luckyDraw';

type GetMemberOptions = {
  activeOnly?: boolean;
  name?: string;
};

export const createMembers = async (members: Partial<MemberType>[]) => {
  const supabase = createClient(cookies());

  const { error, data } = await supabase
    .from(TABLE_NAMES.MEMBER)
    .insert(members)
    .select<'*', MemberType>('*');

  if (error) {
    throw error;
  }

  return data;
};

export const getMembers = async (options: GetMemberOptions = {}) => {
  const supabase = createClient(cookies());

  const { activeOnly, name } = options;

  let query = supabase.from(TABLE_NAMES.MEMBER).select<'*', MemberType>('*');

  if (activeOnly) {
    query = query.eq('active', true);
  }

  if (name) {
    query = query.ilike('name', `%${name}%`);
  }

  const { error, data } = await query;

  if (error) {
    throw error;
  }

  return data;
};

export const updateMember = async (
  changes: Partial<MemberType>,
  id: string,
) => {
  const supabase = createClient(cookies());

  const { error, data } = await supabase
    .from(TABLE_NAMES.MEMBER)
    .update(changes)
    .eq('id', id)
    .select<'*', MemberType>()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return data;
};

export const deleteMember = async (ids: string[]) => {
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
  startTime?: DateTime | string;
  endTime?: DateTime | string;
  order?: 'asc' | 'desc';
};

export const getEvents = async (options?: GetEventsOptions) => {
  const supabase = createClient(cookies());

  const query = supabase.from(TABLE_NAMES.EVENT).select<'*', EventType>('*');

  if (options) {
    if (options.startTime) {
      const startTime =
        typeof options.startTime === 'string'
          ? DateTime.fromISO(options.startTime)
          : options.startTime;
      query.gte('date', startTime.toUTC().toISO());
    }

    if (options.endTime) {
      const endTime =
        typeof options.endTime === 'string'
          ? DateTime.fromISO(options.endTime)
          : options.endTime;
      query.lte('date', endTime.toUTC().toISO());
    }

    query.order('date', { ascending: options?.order === 'asc' });
  }

  const { error, data } = await query;

  if (error) {
    throw error;
  }

  return data;
};

export const createLuckyDraw = async (event: Partial<LuckyDrawType>) => {
  const supabase = createClient(cookies());

  const { error, data } = await supabase
    .from(TABLE_NAMES.LUCKY_DRAW)
    .insert(event)
    .select<'*', LuckyDrawType>('*');

  if (error) {
    throw error;
  }

  return data;
};

type GetLuckyDrawOptions = {
  startTime?: DateTime | string;
  endTime?: DateTime | string;
  order?: 'asc' | 'desc';
};

export const getLuckyDraws = async (options?: GetLuckyDrawOptions) => {
  const supabase = createClient(cookies());

  const query = supabase
    .from(TABLE_NAMES.LUCKY_DRAW)
    .select<'*', LuckyDrawType>('*');

  if (options) {
    if (options.startTime) {
      const startTime =
        typeof options.startTime === 'string'
          ? DateTime.fromISO(options.startTime)
          : options.startTime;
      query.gte('date', startTime.toUTC().toISO());
    }

    if (options.endTime) {
      const endTime =
        typeof options.endTime === 'string'
          ? DateTime.fromISO(options.endTime)
          : options.endTime;
      query.lte('date', endTime.toUTC().toISO());
    }

    query.order('date', { ascending: options?.order === 'asc' });
  }

  const { error, data } = await query;

  if (error) {
    throw error;
  }

  return data;
};

export const deleteLuckyDraw = async (ids: string[]) => {
  const supabase = createClient(cookies());

  const { error, data } = await supabase
    .from(TABLE_NAMES.LUCKY_DRAW)
    .delete()
    .in('id', ids);

  if (error) {
    throw error;
  }

  return data;
};
