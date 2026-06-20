import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useFridgeMagnetStore } from '@/store/useFridgeMagnetStore';
import type { FridgeMagnet } from '@/types';

interface CollectionMapProps {
  onMagnetClick?: (magnet: FridgeMagnet) => void;
  height?: string;
}

function createCustomIcon(count: number) {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 36px;
          height: 36px;
          background: #d45f3a;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(212, 95, 58, 0.4);
        "></div>
        <span style="
          position: absolute;
          color: white;
          font-weight: 700;
          font-size: 13px;
          font-family: 'Playfair Display', serif;
          transform: rotate(0deg);
          z-index: 1;
        ">${count}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

export default function CollectionMap({ onMagnetClick, height = '500px' }: CollectionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const magnets = useFridgeMagnetStore((s) => s.magnets);
  const filters = useFridgeMagnetStore((s) => s.filters);

  const filteredMagnets = useMemo(() => {
    return magnets.filter((m) => {
      if (filters.material !== '全部' && m.material !== filters.material) return false;
      if (filters.category !== '全部' && m.category !== filters.category) return false;
      if (filters.year !== '全部') {
        const year = new Date(m.purchaseDate).getFullYear();
        if (year !== filters.year) return false;
      }
      if (filters.displayStatus !== '全部' && m.displayStatus !== filters.displayStatus)
        return false;
      return true;
    });
  }, [magnets, filters]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      center: [30, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    type CityGroup = { magnets: FridgeMagnet[]; lat: number; lng: number };
    const cityGroups: Record<string, CityGroup> = {};

    filteredMagnets.forEach((magnet) => {
      if (!magnet.coordinates) return;
      const key = `${magnet.country}-${magnet.city}`;
      if (!cityGroups[key]) {
        cityGroups[key] = {
          magnets: [],
          lat: magnet.coordinates.lat,
          lng: magnet.coordinates.lng,
        };
      }
      cityGroups[key].magnets.push(magnet);
    });

    const bounds: L.LatLngTuple[] = [];

    Object.entries(cityGroups).forEach(([key, data]) => {
      const [country, city] = key.split('-');
      const cityMagnets = filteredMagnets.filter((m) => m.city === city && m.country === country);

      const popupContent = document.createElement('div');
      popupContent.className = 'p-0';
      popupContent.innerHTML = `
        <div class="p-4 border-b border-ink-100">
          <h3 class="font-display font-semibold text-ink-800 text-base">${country} · ${city}</h3>
          <p class="text-xs text-ink-500 mt-0.5">${data.magnets.length} 枚冰箱贴</p>
        </div>
        <div class="p-3 max-h-48 overflow-y-auto space-y-2">
          ${cityMagnets
            .map(
              (m) => `
                <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-cream-50 cursor-pointer transition-colors magnet-item" data-id="${m.id}">
                  <img src="${m.frontImage}" alt="${m.name}" class="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-ink-800 text-sm truncate">${m.name}</p>
                    <p class="text-xs text-ink-500">${m.material} · ${m.purchaseDate}</p>
                  </div>
                </div>
              `
            )
            .join('')}
        </div>
      `;

      popupContent.querySelectorAll('.magnet-item').forEach((el) => {
        const id = el.getAttribute('data-id');
        const magnet = cityMagnets.find((m) => m.id === id);
        if (magnet && onMagnetClick) {
          el.addEventListener('click', () => onMagnetClick(magnet));
        }
      });

      const marker = L.marker([data.lat, data.lng], {
        icon: createCustomIcon(data.magnets.length),
      })
        .addTo(mapInstanceRef.current!)
        .bindPopup(popupContent, {
          maxWidth: 300,
          minWidth: 280,
          className: 'custom-popup',
        });

      markersRef.current.push(marker);
      bounds.push([data.lat, data.lng]);
    });

    if (bounds.length > 0 && mapInstanceRef.current) {
      const latLngBounds = L.latLngBounds(bounds);
      mapInstanceRef.current.fitBounds(latLngBounds, {
        padding: [60, 60],
        maxZoom: 6,
      });
    }
  }, [filteredMagnets, onMagnetClick]);

  return (
    <div className="card overflow-hidden">
      <div ref={mapRef} style={{ width: '100%', height }} />
    </div>
  );
}
