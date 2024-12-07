import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Produkt nie znaleziony</h1>
      <p>Przepraszamy, ale produkt któego szukasz nie istnieje.</p>
      <Link href="/products">Go back to Products</Link>
    </div>
  );
};