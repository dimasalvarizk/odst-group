import { images } from './images';

export interface Service {
  id: string;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  imageLeft: boolean;
  link: string;
}

export const services: Service[] = [
  {
    id: 'hotels',
    badge: 'Premium Hospitality',
    title: 'ODST Hotels',
    description: 'Provides hospitality services close to the Holy sites. Our hotels offer comfort, convenience, and spiritual tranquility for many pilgrims. Experience refined stays with panoramic views of the Holy Mosque.',
    imageUrl: images.hotelLobby,
    imageLeft: false,
    link: '#hotels',
  },
  {
    id: 'airlines',
    badge: 'Aviation Charters',
    title: 'ODST Airlines',
    description: 'Seamless journeys to the Holy Land. Dedicated charters and flight solutions with exceptional comfort, premium catering, and a deeply attentive service tailored for your spiritual journey.',
    imageUrl: images.airplaneSalute,
    imageLeft: true,
    link: '#airlines',
  },
  {
    id: 'travel',
    badge: 'Pilgrim Services',
    title: 'ODST Tour & Travel',
    description: 'Complete pilgrim and package travel solutions for your needs. From guide grouping to highly personalized guided tours and excellent ground transportation, we handle every detail so you can focus on your spiritual fulfillment.',
    imageUrl: images.travelLuggage,
    imageLeft: false,
    link: '#travel',
  },
];

export default services;
