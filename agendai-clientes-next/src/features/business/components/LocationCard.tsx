'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import type { Address } from '../types';

interface LocationCardProps {
  address: Address;
  fullAddress: string;
}

/**
 * Card de localização com mapa embarcado do Google Maps e link para direções.
 */
export const LocationCard: React.FC<LocationCardProps> = ({ address, fullAddress }) => {
  if (!address) {
    return null;
  }

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=16&output=embed`;

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      <div className="p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Localização</h3>

        {/* Mapa */}
        <a
          href={mapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4 rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
        >
          <iframe
            width="100%"
            height="200"
            style={{ border: 0, pointerEvents: 'none' }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapsEmbedUrl}
          />
        </a>

        <p className="text-zinc-300 text-sm mb-1 font-medium">{fullAddress}</p>

        {/* Botão de direções */}
        <a
          href={mapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mt-4 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-lg transition-colors"
        >
          <MapPin size={18} />
          <span className="font-medium text-sm">Como chegar</span>
        </a>
      </div>
    </div>
  );
};
