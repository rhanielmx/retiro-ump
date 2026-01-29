import { Photo } from './Photo';
import { photosData } from './photosData';

export function PhotosSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Fotos do Local
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {photosData.map((photo) => (
            <Photo key={photo.id} photo={photo} />
          ))}
        </div>
      </div>
    </section>
  );
}