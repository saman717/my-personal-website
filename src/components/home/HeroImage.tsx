import Image from 'next/image';

interface HeroImageProps {
  src: string;
  alt: string;
}

export default function HeroImage({ src, alt }: HeroImageProps) {
  return (
    <div className="shrink-0">
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-116 lg:h-116 rounded-full overflow-hidden border-4 border-[#1E1E24] shadow-2xl shadow-black/50">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority
          
        />
      </div>
    </div>
  );
}