import HeroImage from '@/components/hero-image/HeroImage';
import ProductList from '@/components/products-list/ProductsList';

export default function HomePage() {
  const products = [
    { id: '1', name: 'Buty Nike', brand: 'Nike', price: 299, size: '42', image: '/buty.webp', description: 'Wygodne buty sportowe Nike' },
    { id: '2', name: 'Kurtka Adidas', brand: 'Adidas', price: 499, size: 'M', image: '/kurtka.webp', description: 'Stylowa kurtka Adidas na każdą pogodę' },
    { id: '3', name: 'T-shirt Puma', brand: 'Puma', price: 99, size: 'L', image: '/t-shirt.webp', description: 'Komfortowy T-shirt Puma' },
    { id: '4', name: 'Spodnie Levi\'s', brand: 'Levi\'s', price: 249, size: '32', image: '/spodnie.webp', description: 'Klasyczne spodnie Levi\'s' },
    { id: '5', name: 'Buty Nike', brand: 'Nike', price: 299, size: '42', image: '/buty.webp', description: 'Wygodne buty sportowe Nike' },
    { id: '6', name: 'Kurtka Adidas', brand: 'Adidas', price: 499, size: 'M', image: '/kurtka.webp', description: 'Stylowa kurtka Adidas na każdą pogodę' },
    { id: '7', name: 'T-shirt Puma', brand: 'Puma', price: 99, size: 'L', image: '/t-shirt.webp', description: 'Komfortowy T-shirt Puma' },
    { id: '8', name: 'Spodnie Levi\'s', brand: 'Levi\'s', price: 249, size: '32', image: '/spodnie.webp', description: 'Klasyczne spodnie Levi\'s' }
  ];

  return (
    <div>
      <HeroImage />
      <div className="container mx-auto px-4">
        <ProductList products={products} />
      </div>
    </div>
  );
};
