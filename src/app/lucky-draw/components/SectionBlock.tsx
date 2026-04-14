import { cn } from '@/lib/utils';
import { ClassValue } from 'clsx';
import { PropsWithChildren } from 'react';

const SectionBlock = ({
  children,
  className,
}: PropsWithChildren<{ className?: ClassValue }>) => (
  <div
    className={cn(
      'px-6 py-8 border rounded-[14px] bg-white flex flex-col gap-y-6',
      className,
    )}
  >
    {children}
  </div>
);

export default SectionBlock;