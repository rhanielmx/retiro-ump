import { MapPin } from 'lucide-react';
import type { LocationInfo as LocationInfoType } from './locationData';

interface LocationInfoProps {
  location: LocationInfoType;
}

export function LocationInfo({ location }: LocationInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <MapPin className="h-6 w-6 text-primary mt-1" />
        <div>
          <h3 className="font-semibold text-lg">{location.name}</h3>
          <p className="text-muted-foreground">
            {location.description}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {location.address}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">O que oferecemos:</h4>
        <ul className="space-y-1 text-muted-foreground">
          {location.features.map((feature, index) => (
            <li key={index}>• {feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}