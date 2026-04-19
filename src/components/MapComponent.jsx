import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Vite/React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapAutoCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
      setTimeout(() => map.invalidateSize(), 200);
    }
  }, [center, map]);
  return null;
};

const MapBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
      setTimeout(() => map.invalidateSize(), 200);
    }
  }, [points, map]);
  return null;
};

const MapComponent = ({ points = [], center = [4.570868, -74.297333], zoom = 5, height = "400px", autoZoom = false }) => {
  return (
    <div style={{ height, width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point, idx) => (
          point.lat && point.lng && (
            <Marker key={idx} position={[point.lat, point.lng]}>
              <Popup>
                <div style={{ padding: '5px' }}>
                  <strong style={{ fontStyle: 'italic' }}>{point.title}</strong><br />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{point.subtitle}</span>
                </div>
              </Popup>
            </Marker>
          )
        ))}
        {autoZoom ? <MapBounds points={points} /> : <MapAutoCenter center={center} />}
        <ForceInvalidate />
      </MapContainer>
    </div>
  );
};

const ForceInvalidate = () => {
  const map = useMap();
  useEffect(() => {
    // Force a recalculation of the map size after the component mounts
    // and after a short delay to account for layout shifts
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 500);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

export default MapComponent;
