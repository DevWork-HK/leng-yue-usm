import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn, getAvatarUrl } from '@/lib/utils';
import { CLASS } from '@/constants';

type ClassAvatarProps = {
  memberClass: CLASS;
  fallbackText?: string;
  size?: React.ComponentProps<typeof Avatar>['size'];
};

const ClassAvatar = ({
  memberClass,
  fallbackText = '',
  size = 'lg',
}: ClassAvatarProps) => {
  return (
    <Avatar size={size}>
      <AvatarImage
        src={getAvatarUrl(memberClass)}
        className={cn(
          'p-0.5 object-cover border-2 border-gray-400',
          memberClass === CLASS.CANG_LAN && 'border-(--cang-lan-primary)',
          memberClass === CLASS.CHAO_GUANG && 'border-(--chao-guang-primary)',
          memberClass === CLASS.JIU_LING && 'border-(--jiu-ling-primary)',
          memberClass === CLASS.LONG_YIN && 'border-(--long-yin-primary)',
          memberClass === CLASS.SHEN_XIANG && 'border-(--shen-xiang-primary)',
          memberClass === CLASS.SU_WEN && 'border-(--su-wen-primary)',
          memberClass === CLASS.SUI_MENG && 'border-(--sui-meng-primary)',
          memberClass === CLASS.TIE_YI && 'border-(--tie-yi-primary)',
          memberClass === CLASS.XUAN_JI && 'border-(--xuan-ji-primary)',
          memberClass === CLASS.XUE_HE && 'border-(--xue-he-primary)',
        )}
      />
      <AvatarFallback>{fallbackText.substring(0, 2)}</AvatarFallback>
    </Avatar>
  );
};

export default ClassAvatar;
