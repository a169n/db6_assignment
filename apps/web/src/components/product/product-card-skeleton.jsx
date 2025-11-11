import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProductCardSkeleton = () => (
  <Card className="flex h-full flex-col">
    <CardHeader className="space-y-3">
      <Skeleton className="h-40 w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </CardHeader>
    <CardContent className="flex flex-1 flex-col justify-between space-y-4">
      <Skeleton className="h-20 w-full" />
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </CardContent>
  </Card>
);
