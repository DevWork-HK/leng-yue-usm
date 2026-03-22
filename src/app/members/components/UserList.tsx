import User from './User';
import { ClassValue } from 'clsx';
import { cn, getPositionHierarchy } from '@/lib/utils';
import { getUsers } from '@/lib/supabase/actions';
import { UserType } from '@/schema/user';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UserListProps = {
  className?: ClassValue;
};

const UserList = async ({ className }: UserListProps) => {
  const users = await getUsers();

  const [activeUsers, inActiveUsers] = users
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
      [[], []] as UserType[][],
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
            Active Users
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-y-5 mb-6 mt-3">
            {activeUsers?.map((user) => (
              <User
                key={`${user.name}|${user.class}|${user.position}`}
                user={user}
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
            Inactive Users
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-y-5 mb-12 mt-3">
            {inActiveUsers?.map((user) => (
              <User
                key={`${user.name}|${user.class}|${user.position}`}
                user={user}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default UserList;
