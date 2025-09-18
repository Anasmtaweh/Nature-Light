export const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
    );
    const data = await response.json();

    if (data && data.address) {
      // Prioritize city, then town, then village, then county, then state, then country
      return (
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.county ||
        data.address.state ||
        data.address.country ||
        data.display_name
      );
    }
    return null;
  } catch (error) {
    console.error("Error during reverse geocoding:", error);
    return null;
  }
};
