export interface SkyEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string; // General location string (e.g., "Northern Hemisphere")
  visibility: string;
  city?: string;    // Optional: Specific city
  state?: string;   // Optional: Specific state/region
  country?: string; // Optional: Specific country
}