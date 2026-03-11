import { cn } from '@/helper';
import User from './User';
import { ClassValue } from 'clsx';

type UserListProps = {
  className?: ClassValue;
};

const UserList = ({ className }: UserListProps) => {
  return (
    <div className={cn('flex flex-col gap-y-6', className)}>
      <User />
      <User />
      <User />
      <User />
      <User />
      <User />
      <User />
      <User />
    </div>
  );
};

export default UserList;
