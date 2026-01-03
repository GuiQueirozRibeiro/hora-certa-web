'use client';

import React from 'react';
import { gsap } from 'gsap';

interface PaymentMethodsCardProps {
  methods?: string[];
}

const DEFAULT_PAYMENT_METHODS = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix'];

/**
 * Card de formas de pagamento aceitas.
 * Usa GSAP para animações de hover.
 */
export const PaymentMethodsCard: React.FC<PaymentMethodsCardProps> = ({ 
  methods = DEFAULT_PAYMENT_METHODS 
}) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.1,
      y: -4,
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      y: 0,
      backgroundColor: '#27272a',
      color: '#d4d4d8',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
      <h3 className="text-white font-semibold text-lg mb-4">Formas de pagamento</h3>
      <div className="flex flex-wrap gap-2">
        {methods.map((payment, index) => (
          <span
            key={index}
            className="payment-badge bg-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {payment}
          </span>
        ))}
      </div>
    </div>
  );
};
