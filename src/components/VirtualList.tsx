import React, { useMemo, useCallback, memo } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualListProps<T> {
  items: T[];
  height: number | string;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscanCount?: number;
}

function VirtualListComponent<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className = '',
  overscanCount = 5,
}: VirtualListProps<T>) {
  const itemData = useMemo(() => ({ items, renderItem }), [items, renderItem]);

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = items[index];
      return (
        <div style={style} className="flex items-center">
          {renderItem(item, index)}
        </div>
      );
    },
    [items, renderItem]
  );

  return (
    <div className={className} style={{ height }}>
      <AutoSizer>
        {({ height: autoHeight, width }) => (
          <List
            height={autoHeight}
            itemCount={items.length}
            itemSize={itemHeight}
            width={width}
            overscanCount={overscanCount}
            itemData={itemData}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}

export const VirtualList = memo(VirtualListComponent) as <T>(
  props: VirtualListProps<T>
) => React.ReactElement;

// Optimized product list component
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface OptimizedProductListProps {
  products: Product[];
  height?: number | string;
  onProductClick?: (product: Product) => void;
}

export const OptimizedProductList: React.FC<OptimizedProductListProps> = memo(({
  products,
  height = 400,
  onProductClick,
}) => {
  const renderProduct = useCallback(
    (product: Product, index: number) => (
      <div
        key={product.id}
        className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => onProductClick?.(product)}
      >
        <div className="flex items-center space-x-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
            loading="lazy"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <p className="text-gray-600">₹{product.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    ),
    [onProductClick]
  );

  return (
    <VirtualList
      items={products}
      height={height}
      itemHeight={80}
      renderItem={renderProduct}
      className="border border-gray-200 rounded-lg"
    />
  );
});

OptimizedProductList.displayName = 'OptimizedProductList'; 