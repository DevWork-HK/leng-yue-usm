import { UserType } from '@/schema/user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getAvatarUrl } from '@/lib/utils';

type ClassAvatarProps = {
  user: UserType;
};

const ClassAvatar = ({ user }: ClassAvatarProps) => {
  return (
    <Avatar size="lg">
      <AvatarImage
        src={getAvatarUrl(user.class)}
        className="p-1 object-cover"
      />
      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
    </Avatar>
  );
};

export default ClassAvatar;
