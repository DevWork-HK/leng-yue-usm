import { cn } from '@/helper';
import { ClassValue } from 'clsx';
import { PropsWithChildren } from 'react';

type ButtonPros = {
  preFixIcon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  variant?: 'primary' | 'secondary' | 'none';
  className?: ClassValue;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ variant = 'primary', children, className, ...restProps }: PropsWithChildren<ButtonPros>) => {
  return (
    <button
      className={cn(
        'flex gap-2 px-5 py-2 rounded-lg cursor-pointer transition-colors items-center',
        variant === 'primary' && 'text-white bg-black hover:bg-gray-800',
        variant === 'secondary' && 'text-black border-2 border-zinc-300 hover:bg-zinc-200',
        className,
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;
