import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { Photo as PhotoType } from './photosData';

interface PhotoProps {
  photo: PhotoType;
}

export function Photo({ photo }: PhotoProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </Card>
  );
}