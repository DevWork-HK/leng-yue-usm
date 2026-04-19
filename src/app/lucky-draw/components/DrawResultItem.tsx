import { MemberType } from '@/schema/member';
import { CreateLuckyDrawType } from './LuckyDrawEvent';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';
import ClassAvatar from '@/components/custom/ClassAvatar';

const DrawResultItem = ({
  member,
  result,
}: {
  member: MemberType;
  result: Pick<CreateLuckyDrawType['result'][number], 'name' | 'priority'>;
}) => {
  return (
    <div
      className={cn(
        'flex gap-8 border-2 rounded-lg p-6 items-center',
        result.priority === 1
          ? 'bg-yellow-100 border-yellow-400'
          : 'bg-gray-200 border-gray-400',
      )}
    >
      <Trophy
        size={32}
        className={cn(
          result.priority === 1 ? 'text-yellow-500' : 'text-gray-600',
        )}
      />
      <div className="flex items-center gap-4">
        <ClassAvatar memberClass={member.class} fallbackText={member.name} />
        <div>{member.name}</div>
      </div>
      <div
        className={cn(
          'ml-auto rounded-lg p-2 font-medium border',
          result.priority === 1
            ? 'border-yellow-500 text-yellow-700'
            : 'border-gray-400 text-gray-700',
        )}
      >
        {result.name}
      </div>
    </div>
  );
};

export default DrawResultItem;
