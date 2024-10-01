import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Airport } from './types';
import L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

interface MapDisplayProps {
  airport1: Airport;
  airport2: Airport;
}

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;
const toDegrees = (radians: number): number => (radians * 180) / Math.PI;

const calculateGreatCirclePoints = (start: LatLngTuple, end: LatLngTuple, numPoints: number): LatLngTuple[] => {
    const points: LatLngTuple[] = [];
    const lat1 = toRadians(start[0]);
    const lon1 = toRadians(start[1]);
    const lat2 = toRadians(end[0]);
    const lon2 = toRadians(end[1]);

    const dLon = lon2 - lon1;
    const dLat = lat2 - lat1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
                Math.cos(lat1) * Math.cos(lat2) * 
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const R = 6371e3; // Earth's radius in meters

    for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints;

    const A = Math.sin((1 - fraction) * c) / Math.sin(c);
    const B = Math.sin(fraction * c) / Math.sin(c);

    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);

    const lat = toDegrees(Math.atan2(z, Math.sqrt(x * x + y * y)));
    const lon = toDegrees(Math.atan2(y, x));

    points.push([lat, lon]);
    }

    return points;
};

const CustomMarker = ({ position, name }: { position: LatLngTuple; name: string }) => {
    const DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [25, 41], 
        iconAnchor: [12, 41], 
        popupAnchor: [0, -41]
      });

  return (
    <Marker position={position} icon={DefaultIcon}>
      <Popup>{name}</Popup>
      <LocationOnIcon
        style={{
          fontSize: '40px',
          color: 'red',
          position: 'absolute',
          transform: 'translate(-50%, -100%)',
        }}
      />
    </Marker>
  );
};

const MapDisplay: React.FC<MapDisplayProps> = ({ airport1, airport2 }) => {
  const position1: LatLngTuple = [parseFloat(airport1.latitude), parseFloat(airport1.longitude)];
  const position2: LatLngTuple = [parseFloat(airport2.latitude), parseFloat(airport2.longitude)];

  const center: LatLngTuple = [
    (position1[0] + position2[0]) / 2,
    (position1[1] + position2[1]) / 2,
  ];

  const greatCirclePoints = calculateGreatCirclePoints(position1, position2, 100);

  return (
    <MapContainer center={center} zoom={3} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CustomMarker position={position1} name={airport1.name} />
      <CustomMarker position={position2} name={airport2.name} />
      <Polyline positions={greatCirclePoints} color="blue" />
    </MapContainer>
  );
};

export default MapDisplay;