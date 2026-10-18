
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function NigeriaMap() {
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = mapElement.current;
    if (!element) return;

    const map = L.map(element, {
      center: [9.082, 8.675],
      zoom: 5.5,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      touchZoom: false,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const office = L.latLng(6.425, 2.890);

    L.circleMarker(office, {
      radius: 7,
      color: '#ffffff',
      weight: 2,
      fillColor: '#278747',
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup('Raynoid Global Energy — Badagry, Lagos');

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div
        className="relative h-full w-full"
        style={{
          maskImage: 'url("/assets/nigeria-map.svg")',
          WebkitMaskImage: 'url("/assets/nigeria-map.svg")',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
        }}
      >
        <div ref={mapElement} className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  );
}
