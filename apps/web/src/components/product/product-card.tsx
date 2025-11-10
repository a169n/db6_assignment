import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  description?: string;
  onView?: () => void;
  footer?: React.ReactNode;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  slug,
  price,
  image,
  description,
  onView,
  footer
}) => {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="space-y-3">
        <div className="aspect-[4/3] overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
          {image ? (
            <img src={image} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
              No image
            </div>
          )}
        </div>
        <CardTitle className="line-clamp-1 text-base">{name}</CardTitle>
        <span className="text-sm font-semibold text-brand">${price.toFixed(2)}</span>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4 text-sm">
        {description && <p className="line-clamp-3 text-slate-500 dark:text-slate-400">{description}</p>}
        <div className="mt-auto flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" asChild onClick={onView}>
            <Link to={`/products/${slug}`}>View</Link>
          </Button>
          {footer}
        </div>
      </CardContent>
    </Card>
  );
};
