import HeroImage from '@/components/hero-image/HeroImage';
import ProductList from '@/components/products-list/ProductsList';
import { Product } from '@/lib/types';
import { fetchProducts } from '@/lib/data';

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products: Product[] = await fetchProducts();

  return (
    <div>
      <HeroImage />
      <div className="container mx-auto px-4">
        <ProductList products={products} />
      </div>
    </div>
  );
};
