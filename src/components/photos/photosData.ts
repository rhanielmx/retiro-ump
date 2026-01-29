export interface Photo {
  id: number;
  src: string;
  alt: string;
}

export const photosData: Photo[] = [
  { id: 1, src: '/1.jpeg', alt: 'Momento do Retiro 1' },
  { id: 2, src: '/2.jpeg', alt: 'Momento do Retiro 2' },
  { id: 3, src: '/3.jpeg', alt: 'Momento do Retiro 3' },
  { id: 4, src: '/4.jpeg', alt: 'Momento do Retiro 4' },
  { id: 5, src: '/5.jpeg', alt: 'Momento do Retiro 5' },
  { id: 6, src: '/6.jpeg', alt: 'Momento do Retiro 6' }
];