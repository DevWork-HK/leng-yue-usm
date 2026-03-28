import { UserType } from '@/schema/user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn, getAvatarUrl } from '@/lib/utils';
import { CLASS } from '@/constants';

type ClassAvatarProps = {
  user: UserType;
  size?: React.ComponentProps<typeof Avatar>['size'];
};

const ClassAvatar = ({ user, size = 'lg' }: ClassAvatarProps) => {
  return (
    <Avatar size={size}>
      <AvatarImage
        src={getAvatarUrl(user.class)}
        className={cn(
          'p-0.5 object-cover border-2 border-gray-400',
          user.class === CLASS.CANG_LAN && 'border-[#a4bcfc]',
          user.class === CLASS.CHAO_GUANG && 'border-[#8cbcfc]',
          user.class === CLASS.JIU_LING && 'border-[#8c54f4]',
          user.class === CLASS.LONG_YIN && 'border-2 border-[#9cf4c4]',
          user.class === CLASS.SHEN_XIANG && 'border-2 border-[#4c6cec]',
          user.class === CLASS.SU_WEN && 'border-2 border-[#e4a4a4]',
          user.class === CLASS.SUI_MENG && 'border-2 border-[#b4e4e3]',
          user.class === CLASS.TIE_YI && 'border-2 border-[#e4b47c]',
          user.class === CLASS.XUAN_JI && 'border-2 border-[#f4e4a4]',
          user.class === CLASS.XUE_HE && 'border-2 border-[#cc5c5c]',
        )}
      />
      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
    </Avatar>
  );
};

export default ClassAvatar;
