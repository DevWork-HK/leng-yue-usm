import User from './User';
import { ClassValue } from 'clsx';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { UserType } from '@/schema/user';
import { cn } from '@/lib/utils';

type UserListProps = {
  className?: ClassValue;
};

const UserList = async ({ className }: UserListProps) => {
  const supabase = createClient(cookies());

  const { data } = await supabase.from('Member').select<'*', UserType>('*');

  return (
    <div className={cn('flex flex-col gap-y-6', className)}>
      {data?.map((user, index) => (
        <User key={index} user={user} />
      ))}
    </div>
  );
};

export default UserList;
