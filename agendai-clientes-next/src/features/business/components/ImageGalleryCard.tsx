'use client';

import React from 'react';
import type { Business } from '../types';

interface ImageGalleryCardProps {
  business: Business;
  currentImageIndex: number;
  onNavigate: (index: number) => void;
  carouselImageRef: React.RefObject<HTMLImageElement | null>;
}

/**
 * Galeria de imagens com navegação em carrossel.
 * Dependências: recebe ref e callbacks de navegação via props.
 */
export const ImageGalleryCard: React.FC<ImageGalleryCardProps> = ({
  business,
  currentImageIndex,
  onNavigate,
  carouselImageRef,
}) => {
  if (!business.images || business.images.length === 0) {
    return null;
  }

  const totalImages = business.images.length;
  const hasMultipleImages = totalImages > 1;

  const handlePrevious = () => {
    const prevIndex = currentImageIndex === 0 ? totalImages - 1 : currentImageIndex - 1;
    onNavigate(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = currentImageIndex === totalImages - 1 ? 0 : currentImageIndex + 1;
    onNavigate(nextIndex);
  };

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      <div className="p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Galeria</h3>

        <div className="relative overflow-hidden rounded-xl">
          <img
            ref={carouselImageRef}
            src={business.images[currentImageIndex]}
            alt={`${business.name} - Imagem ${currentImageIndex + 1}`}
            className="h-48 w-full object-cover object-center"
          />

          {hasMultipleImages && (
            <>
              {/* Indicadores de posição */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {business.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigate(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Ir para imagem ${index + 1}`}
                  />
                ))}
              </div>

              {/* Contador de imagens */}
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-lg">
                {currentImageIndex + 1} / {totalImages}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
