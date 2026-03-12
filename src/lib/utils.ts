import { CLASS, classNameMap } from '@/constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getClassName(classEnum: CLASS) {
  const className = classNameMap.get(classEnum);

  if (!className) {
    throw new Error('Class is not allowed.');
  }

  return className;
}
