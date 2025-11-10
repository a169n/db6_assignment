import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '@/lib/utils';
const Card = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn('rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900', className), ...props })));
Card.displayName = 'Card';
const CardHeader = ({ className, ...props }) => (_jsx("div", { className: cn('mb-4 space-y-1', className), ...props }));
const CardTitle = ({ className, ...props }) => (_jsx("h3", { className: cn('text-lg font-semibold leading-none tracking-tight', className), ...props }));
const CardContent = ({ className, ...props }) => (_jsx("div", { className: cn('text-sm text-slate-600 dark:text-slate-300', className), ...props }));
export { Card, CardHeader, CardTitle, CardContent };
