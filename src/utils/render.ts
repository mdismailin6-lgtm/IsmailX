import { ReactNode } from "react";

const hasValue = (value: any): boolean => {
  if (value === undefined || value === null || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

export const renderIfVisible = (
  isVisible: boolean | undefined,
  value: any,
  component: ReactNode
): ReactNode | null => {
  if (isVisible === true && hasValue(value)) {
    return component;
  }
  return null;
};
