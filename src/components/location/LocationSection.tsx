import { LocationInfo } from './LocationInfo';
import { LocationMap } from './LocationMap';
import { locationData } from './locationData';

export function LocationSection() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Localização
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <LocationInfo location={locationData} />
          <LocationMap location={locationData} />
        </div>
      </div>
    </section>
  );
}