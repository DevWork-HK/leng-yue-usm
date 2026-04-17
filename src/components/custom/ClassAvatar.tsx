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
          member.class === CLASS.CANG_LAN && 'border-(--cang-lan-primary)',
          member.class === CLASS.CHAO_GUANG && 'border-(--chao-guang-primary)',
          member.class === CLASS.JIU_LING && 'border-(--jiu-ling-primary)',
          member.class === CLASS.LONG_YIN && 'border-(--long-yin-primary)',
          member.class === CLASS.SHEN_XIANG && 'border-(--shen-xiang-primary)',
          member.class === CLASS.SU_WEN && 'border-(--su-wen-primary)',
          member.class === CLASS.SUI_MENG && 'border-(--sui-meng-primary)',
          member.class === CLASS.TIE_YI && 'border-(--tie-yi-primary)',
          member.class === CLASS.XUAN_JI && 'border-(--xuan-ji-primary)',
          member.class === CLASS.XUE_HE && 'border-(--xue-he-primary)',
        )}
      />
      <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
    </Avatar>
  );
};

export default ClassAvatar;
