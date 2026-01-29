import type { LocationInfo as LocationInfoType } from './locationData';

interface LocationMapProps {
  location: LocationInfoType;
}

export function LocationMap({ location }: LocationMapProps) {
  return (
    <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
      <iframe
        src={location.mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={location.mapTitle}
      />
    </div>
  );
}