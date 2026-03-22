import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

type TabProps = {
  isActive: boolean;
  link: string;
};

const Tab = ({ isActive, link, children }: PropsWithChildren<TabProps>) => {
  return (
    <Link
      href={link}
      className={cn(
        'text-sm px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-zinc-100 flex gap-x-2',
        isActive && 'bg-zinc-200',
      )}
    >
      {children}
    </Link>
  );
};

export default Tab;
