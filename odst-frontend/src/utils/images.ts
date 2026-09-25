import odstHotels from '../assets/odst-hotels.webp';
import odstTravel from '../assets/odst-travel.webp';
import odstTourTravel from '../assets/odst-tour-travel.webp';
import hero1 from '../assets/hero1.webp';
import hero2 from '../assets/hero2.webp';
import hero3 from '../assets/hero3.webp';

export const images = {
  // Local hero slider images
  hero1,
  hero2,
  hero3,
  
  // Hero background for contact page
  contactHero: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1920&q=85",

  // Local premium default single images
  hotelLobby: odstHotels,
  airplaneSalute: odstTravel,
  travelLuggage: odstTourTravel,

  // Curated Multi-Slide Sets for Auto-Rotating Carousels
  hotelSlides: [
    odstHotels,
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  ],
  airlineSlides: [
    odstTravel,
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=1200&q=80",
  ],
  travelSlides: [
    odstTourTravel,
    "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
  ],
};
