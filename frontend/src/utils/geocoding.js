export const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
    const data = await res.json();
    if (data && data.display_name) {
      // Nominatim usually returns a long string, let's just take the first two or three parts
      const parts = data.display_name.split(', ');
      if (parts.length >= 3) {
        return `${parts[0]}, ${parts[1]}, ${parts[parts.length - 1]}`;
      }
      return data.display_name;
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (err) {
    console.error('Reverse geocoding failed', err);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};
