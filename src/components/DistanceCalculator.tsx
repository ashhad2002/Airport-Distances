import { Airport } from "./types";
  
  const DistanceCalculator = (airport1: Airport, airport2: Airport): number => {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const R = 3440.1; // Radius of the Earth in nautical miles
  
    const lat1 = toRadians(parseFloat(airport1.latitude));
    const lat2 = toRadians(parseFloat(airport2.latitude));
    const deltaLat = lat2 - lat1;
    const deltaLon = toRadians(parseFloat(airport2.longitude) - parseFloat(airport1.longitude));
  
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c;
  };
  
  export default DistanceCalculator;
  