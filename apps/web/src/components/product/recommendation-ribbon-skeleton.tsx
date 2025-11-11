import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductGridSkeleton } from './product-grid-skeleton';

export const RecommendationRibbonSkeleton: React.FC = () => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-48" />
    </div>
    <ProductGridSkeleton count={3} />
  </section>
);
