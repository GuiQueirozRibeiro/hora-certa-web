'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { formatPhone } from '../utils';

interface SocialLinksCardProps {
  whatsappLink?: string | null;
}

/**
 * Card de redes sociais com link do WhatsApp.
 */
export const SocialLinksCard: React.FC<SocialLinksCardProps> = ({ whatsappLink }) => {
  const getWhatsappUrl = (link: string) => {
    return link.includes('wa.me') ? link : `https://wa.me/${link.replace(/\D/g, '')}`;
  };

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
      <h3 className="text-white font-semibold text-lg mb-4">Redes Sociais</h3>
      <div className="flex gap-4">
        {whatsappLink && (
          <a
            href={getWhatsappUrl(whatsappLink)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="text-2xl text-white" />
          </a>
        )}
      </div>
    </div>
  );
};

interface ContactCardProps {
  phone?: string | null;
}

/**
 * Card de contato com telefone e função de copiar.
 */
export const ContactCard: React.FC<ContactCardProps> = ({ phone }) => {
  if (!phone) {
    return null;
  }

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phone);
  };

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
      <h3 className="text-white font-semibold text-lg mb-4">Contato</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Phone size={20} color="#888" />
            </div>
            <span className="text-white text-sm">{formatPhone(phone)}</span>
          </div>
          <button
            onClick={handleCopyPhone}
            className="text-indigo-500 text-xs font-semibold hover:text-indigo-400"
          >
            Copiar
          </button>
        </div>
      </div>
    </div>
  );
};
