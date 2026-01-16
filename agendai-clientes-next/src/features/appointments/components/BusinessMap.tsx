/* eslint-disable @next/next/no-img-element */
/**
 * Mapa e informações do estabelecimento (endereço, nome, imagem).
 */
import React from 'react';
import type { AppointmentWithDetails } from '../../../types/types';

interface BusinessMapProps {
  appointment: AppointmentWithDetails;
}

export function BusinessMap({ appointment }: BusinessMapProps) {
  const { business } = appointment;
  const hasAddress = business?.address?.street_address;

  const addressText = hasAddress && business.address
    ? `${business.address.street_address}, ${business.address.number || ''} ${business.address.neighborhood || ''} ${business.address.city || ''}`
    : '';

  const mapUrl = hasAddress ? `https://www.google.com/maps?q=${encodeURIComponent(addressText)}&z=16&output=embed` : '';
  const googleMapsLink = hasAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}` : '#';

  return (
    <div className="mb-6">
      {/* Mapa */}
      {hasAddress ? (
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative w-full h-48 bg-[#2a2a2a] rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group"
        >
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0, pointerEvents: 'none' }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors pointer-events-none" />
        </a>
      ) : (
        <div className="w-full h-48 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Mapa não disponível</p>
        </div>
      )}

      {/* Informações da empresa */}
      <div className="flex items-center gap-3 mt-4">
        <img
          src={
            business?.image_url ||
            'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=80&h=80&fit=crop'
          }
          alt={business?.name || 'Estabelecimento'}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="text-white font-bold text-base">
            {business?.name || 'Estabelecimento'}
          </h2>
          <p className="text-gray-400 text-xs">
            {hasAddress && business.address
              ? `${business.address.street_address}, ${business.address.number || ''} - ${business.address.neighborhood || ''}, ${business.address.city || ''}`
              : 'Endereço não disponível'}
          </p>
        </div>
      </div>
    </div>
  );
}
