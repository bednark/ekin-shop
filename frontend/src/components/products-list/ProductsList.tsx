import ProductCard from '@/components/product-card/ProductCard';
import { Product } from '@/lib/types';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="mb-36">
      <h2 className="text-4xl font-bold mt-24 mb-24 text-center">Nasza oferta</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
};
