/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CLASS,
  classNameMap,
  DATE_ONLY_FORMAT,
  EVENT,
  eventNameMap,
  IANA_HK_TIME_ZONE,
  POSITION,
  positionHierarchy,
  positionNameMap,
} from '@/constants';
import { clsx, type ClassValue } from 'clsx';
import { CSSProperties, ReactElement } from 'react';
import { ExternalToast, toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { DateTime } from 'luxon';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getClassName(classEnum: CLASS) {
  const className = classNameMap.get(classEnum);

  if (!className) {
    return '';
  }

  return className;
}

export function getPositionName(positionEnum: POSITION) {
  const positionName = positionNameMap.get(positionEnum);

  if (!positionName) {
    return '';
  }

  return positionName;
}

export function getPositionHierarchy(positionEnum: POSITION): number {
  const defaultHierarchy = 999;

  const hierarchy = positionHierarchy.get(positionEnum);

  return hierarchy || defaultHierarchy;
}

export function getEventName(eventEnum: EVENT) {
  const eventName = eventNameMap.get(eventEnum);

  if (!eventName) {
    return '';
  }

  return eventName;
}

// Reference style: https://shadcnstudio.com/docs/components/sonner
function errorToastBox(title: string | ReactElement, data?: ExternalToast) {
  const toastData: ExternalToast = {
    position: 'top-center',
    style: {
      '--normal-bg':
        'color-mix(in oklab, var(--destructive) 10%, var(--background))',
      '--normal-text': 'var(--destructive)',
      '--normal-border': 'var(--destructive)',
      ...data?.style,
    } as CSSProperties,
    ...data,
  };
  toast.error(title, toastData);
}

function successToastBox(title: string | ReactElement, data?: ExternalToast) {
  const toastData: ExternalToast = {
    position: 'top-center',
    style: {
      '--normal-bg':
        'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
      '--normal-text':
        'light-dark(var(--color-green-600), var(--color-green-400))',
      '--normal-border':
        'light-dark(var(--color-green-600), var(--color-green-400))',
      ...data?.style,
    } as CSSProperties,
    ...data,
  };
  toast.success(title, toastData);
}

function warningToastBox(title: string | ReactElement, data?: ExternalToast) {
  const toastData: ExternalToast = {
    position: 'top-center',
    style: {
      '--normal-bg':
        'color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))',
      '--normal-text':
        'light-dark(var(--color-amber-600), var(--color-amber-400))',
      '--normal-border':
        'light-dark(var(--color-amber-600), var(--color-amber-400))',
      ...data?.style,
    } as CSSProperties,
    ...data,
  };
  toast.warning(title, toastData);
}

function infoToastBox(title: string | ReactElement, data?: ExternalToast) {
  const toastData: ExternalToast = {
    position: 'top-center',
    style: {
      '--normal-border': 'black',
      ...data?.style,
    } as CSSProperties,
    ...data,
  };
  toast.info(title, toastData);
}

export const toastBox = {
  error: errorToastBox,
  info: infoToastBox,
  success: successToastBox,
  warning: warningToastBox,
};

type DirtyFields<T> = { [K in keyof T]?: boolean | DirtyFields<T[K]> | null };

export function getDirtyValues<T extends Record<string, any>>(
  dirtyFields: DirtyFields<T>,
  values: T,
): Partial<T> {
  return Object.entries(dirtyFields).reduce((result, [key, dirty]) => {
    if (!dirty) return result;

    const value = values[key as keyof T];
    if (typeof dirty === 'object' && !Array.isArray(dirty)) {
      // Recurse for nested objects
      return { ...result, [key]: getDirtyValues(dirty as any, value as any) };
    }

    // Arrays: send whole if any dirty; primitives: send value
    return { ...result, [key]: value };
  }, {} as Partial<T>);
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDate(
  date: Date | string,
  formatStr: string = DATE_ONLY_FORMAT,
): string {
  return DateTime.fromJSDate(new Date(date))
    .setZone(IANA_HK_TIME_ZONE)
    .toFormat(formatStr);
}

export function getAvatarUrl(classEnum: CLASS, inverted = true) {
  return `/images/${classEnum.toLocaleUpperCase()}${inverted ? '_inverted' : ''}${inverted ? '.jpg' : '.jpeg'}`;
}
