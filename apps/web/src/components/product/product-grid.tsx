import React from 'react';
import { ProductCard, type ProductCardProps } from './product-card';

interface ProductGridProps {
  products: ProductCardProps[];
  onView?: (id: string) => void;
  renderFooter?: (product: ProductCardProps) => React.ReactNode;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onView, renderFooter }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onView={() => onView?.(product.id)}
          footer={renderFooter?.(product)}
        />
      ))}
    </div>
  );
};
