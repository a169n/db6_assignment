import React from 'react';
import { ProductCard, type ProductCardProps } from './product-card';

interface RecommendationRibbonProps {
  products: Array<ProductCardProps & { reason?: string; score?: number }>;
  title: string;
}

export const RecommendationRibbon: React.FC<RecommendationRibbonProps> = ({ products, title }) => {
  if (!products.length) return null;
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
      </div>
      <div className="grid grid-flow-col auto-cols-[minmax(220px,1fr)] gap-4 overflow-x-auto pb-2">
        {products.map((product) => (
          <div key={product.id} className="min-w-[220px]">
            <ProductCard {...product} footer={<p className="text-xs text-slate-500">{product.reason}</p>} />
          </div>
        ))}
      </div>
    </section>
  );
};
