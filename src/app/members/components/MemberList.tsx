import Member from './Member';
import { ClassValue } from 'clsx';
import { cn, getPositionHierarchy } from '@/lib/utils';
import { getMembers } from '@/lib/supabase/actions';
import { MemberType } from '@/schema/member';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type MemberListProps = {
  className?: ClassValue;
};

const MemberList = async ({ className }: MemberListProps) => {
  const members = await getMembers();

  const [activeMembers, inActiveMembers] = members
    .sort(
      (a, b) =>
        getPositionHierarchy(a.position) - getPositionHierarchy(b.position),
    )
    .reduce(
      (acc, cur) => {
        if (cur.active === true) {
          acc[0].push(cur);
        } else {
          acc[1].push(cur);
        }

        return acc;
      },
      [[], []] as MemberType[][],
    );

  return (
    <div className={cn('flex flex-col gap-y-5 mb-12', className)}>
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="group w-full justify-start bg-none data-[state=open]:bg-transparent"
          >
            <ChevronRight className="transition-transform group-data-[state=open]:rotate-90" />{' '}
            Active Members
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-y-5 mb-6 mt-3">
            {activeMembers?.map((member) => (
              <Member
                key={`${member.name}|${member.class}|${member.position}`}
                member={member}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="group w-full justify-start bg-none data-[state=open]:bg-transparent"
          >
            <ChevronRight className="transition-transform group-data-[state=open]:rotate-90" />{' '}
            Inactive Members
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-y-5 mb-12 mt-3">
            {inActiveMembers?.map((member) => (
              <Member
                key={`${member.name}|${member.class}|${member.position}`}
                member={member}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default MemberList;
