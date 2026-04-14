import { MemberType } from '@/schema/member';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn, getAvatarUrl } from '@/lib/utils';
import { CLASS } from '@/constants';

type ClassAvatarProps = {
  member: MemberType;
  size?: React.ComponentProps<typeof Avatar>['size'];
};

const ClassAvatar = ({ member, size = 'lg' }: ClassAvatarProps) => {
  return (
    <Avatar size={size}>
      <AvatarImage
        src={getAvatarUrl(member.class)}
        className={cn(
          'p-0.5 object-cover border-2 border-gray-400',
          member.class === CLASS.CANG_LAN && 'border-[#a4bcfc]',
          member.class === CLASS.CHAO_GUANG && 'border-[#8cbcfc]',
          member.class === CLASS.JIU_LING && 'border-[#8c54f4]',
          member.class === CLASS.LONG_YIN && 'border-2 border-[#9cf4c4]',
          member.class === CLASS.SHEN_XIANG && 'border-2 border-[#4c6cec]',
          member.class === CLASS.SU_WEN && 'border-2 border-[#e4a4a4]',
          member.class === CLASS.SUI_MENG && 'border-2 border-[#b4e4e3]',
          member.class === CLASS.TIE_YI && 'border-2 border-[#e4b47c]',
          member.class === CLASS.XUAN_JI && 'border-2 border-[#f4e4a4]',
          member.class === CLASS.XUE_HE && 'border-2 border-[#cc5c5c]',
        )}
      />
      <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
    </Avatar>
  );
};

export default ClassAvatar;
