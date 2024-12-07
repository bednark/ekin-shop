import { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

interface ProductDetailsProps {
  product: Product;
}

// export default function ProductDetails({ product }: ProductDetailsProps) {
export default function ProductDetails() {
  const product = { id: '1', name: 'Buty Nike', brand: 'Nike', price: 299, size: '42', image: '/buty.webp', description: 'Wygodne buty sportowe Nike' }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-6xl p-8">
        <div className="flex space-x-8">
          <div className="w-1/2">
            <Image src={product.image} alt={product.name} width={600} height={600} className="w-full h-auto" />
          </div>
          <div className="w-1/2 space-y-8">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="text-3xl font-semibold text-blue-600">{product.price} PLN</p>
            <div>
              <h3 className="text-xl font-semibold">Rozmiar:</h3>
              <p>{product.size}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Marka:</h3>
              <p>{product.brand}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Opis produktu:</h3>
              <p>{product.description}</p>
            </div>
            <div>
              <Link href="/" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Powrót do strony głównej
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};