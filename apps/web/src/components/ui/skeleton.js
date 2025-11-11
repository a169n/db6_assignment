import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export const Skeleton = ({ className, ...props }) => (_jsx("div", { className: cn('animate-pulse rounded-md bg-slate-200 dark:bg-slate-800', className), ...props }));
