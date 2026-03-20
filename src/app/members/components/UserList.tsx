import User from './User';
import { ClassValue } from 'clsx';
import { cn } from '@/lib/utils';
import { getUsers } from '@/lib/supabase/actions';

type UserListProps = {
  className?: ClassValue;
};

const UserList = async ({ className }: UserListProps) => {
  const users = await getUsers();

  return (
    <div className={cn('flex flex-col gap-y-5 mb-12', className)}>
      {users?.map((user) => (
        <User key={`${user.name}|${user.class}|${user.position}`} user={user} />
      ))}
    </div>
  );
};

export default UserList;
