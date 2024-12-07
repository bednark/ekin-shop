import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div 
      className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
    >
      <Image src={product.image} alt={product.name} width={500} height={500} className="w-full h-auto" />
      <div className="p-4">
        <h2 className="font-bold text-lg">{product.name}</h2>
        <p className="text-sm text-gray-600">Marka: {product.brand}</p>
        <p className="text-sm text-gray-600">Rozmiar: {product.size}</p>
        <p className="mt-2 font-bold text-xl">{product.price} PLN</p>
        <Link className="mt-4 bg-blue-500 text-white py-2 px-4 rounded block text-center"
          href={`/product/${product.id}`}
        >
          Przejdź do szczegółów produktu
        </Link>
      </div>
    </div>
  );
};
