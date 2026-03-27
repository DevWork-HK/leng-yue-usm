import { UserType } from '@/schema/user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getAvatarUrl } from '@/lib/utils';

type ClassAvatarProps = {
  user: UserType;
  size?: React.ComponentProps<typeof Avatar>['size'];
};

const ClassAvatar = ({ user, size = 'lg' }: ClassAvatarProps) => {
  return (
    <Avatar size={size}>
      <AvatarImage
        src={getAvatarUrl(user.class)}
        className="p-0.5 object-cover"
      />
      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
    </Avatar>
  );
};

export default ClassAvatar;
