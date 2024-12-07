import Image from 'next/image';

export default function HeroImage() {
  return (
    <div className="relative bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <Image
        src="/hero-image.jpg"
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
        className="opacity-60"
      />
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">Ekin shop</h1>
        <p className="text-xl mt-4">Najlepsze produkty w jednym miejscu</p>
      </div>
    </div>
  );
};