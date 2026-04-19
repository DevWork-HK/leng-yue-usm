'use client';

import ClassAvatar from '@/components/custom/ClassAvatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CLASS } from '@/constants';
import { getClassName } from '@/lib/utils';
import { Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const classEnums = Object.values(CLASS);

const QUERY_PRAMS_FILTER_KEY = 'cs';

const MemberFilter = () => {
  const [classes, setClasses] = useState<CLASS[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const filteredClasses = searchParams.getAll('cs') ?? [];

  const onApplyFilter = () => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.delete(QUERY_PRAMS_FILTER_KEY);

    classes.forEach((c) => {
      queryParams.append(QUERY_PRAMS_FILTER_KEY, c);
    });

    setIsOpen(false);
    router.push(`/members?${queryParams.toString()}`);
  };

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          setClasses(filteredClasses as CLASS[]);
        }

        setIsOpen(isOpen);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-5">
        <DropdownMenuGroup>
          <DropdownMenuLabel>職業</DropdownMenuLabel>
          {classEnums.map((classEnum) => (
            <DropdownMenuCheckboxItem
              key={classEnum}
              onSelect={(e) => e.preventDefault()}
              checked={classes.includes(classEnum)}
              onCheckedChange={(checked) =>
                setClasses((classes) =>
                  checked
                    ? [...classes, classEnum]
                    : classes.filter((c) => c !== classEnum),
                )
              }
            >
              <ClassAvatar memberClass={classEnum} size="sm" />
              {getClassName(classEnum)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Button className="w-full" onClick={onApplyFilter}>
            確定
          </Button>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemberFilter;
