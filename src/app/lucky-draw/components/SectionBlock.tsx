import { cn } from '@/lib/utils';
import { ClassValue } from 'clsx';
import { PropsWithChildren, RefAttributes } from 'react';

const SectionBlock = ({
  children,
  className,
  ref,
}: PropsWithChildren<{ className?: ClassValue }> & RefAttributes<HTMLDivElement>) => (
  <div
    ref={ref}
    className={cn(
      'px-6 py-8 border rounded-[14px] bg-white flex flex-col gap-y-6',
      className,
    )}
  >
    {children}
  </div>
);

export default SectionBlock;