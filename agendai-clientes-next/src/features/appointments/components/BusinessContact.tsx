/**
 * Informações de contato do estabelecimento (WhatsApp e telefone).
 * Dependência: usePhoneCopy para copiar telefone.
 */
import React from 'react';
import { Phone } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import type { AppointmentWithDetails } from '../../../types/types';
import { usePhoneCopy } from '../hooks/usePhoneCopy';

interface BusinessContactProps {
  appointment: AppointmentWithDetails;
}

export function BusinessContact({ appointment }: BusinessContactProps) {
  const { business } = appointment;
  const { formatPhoneNumber, handleCopyPhone, copiedPhone } = usePhoneCopy();

  if (!business?.whatsapp_number) {
    return null;
  }

  const whatsappUrl = business.whatsapp_number.includes('wa.me')
    ? business.whatsapp_number
    : `https://wa.me/${business.whatsapp_number.replace(/\D/g, '')}`;

  return (
    <div className="mb-6">
      {/* Botão WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors w-full mb-3"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
        Entrar em contato
      </a>

      {/* Telefone */}
      <div className="flex items-center justify-between bg-[#0d0d0d] rounded-lg p-4 border border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
            <Phone size={20} className="text-gray-500" />
          </div>
          <span className="text-white text-sm">
            {formatPhoneNumber(business.whatsapp_number)}
          </span>
        </div>
        <button
          onClick={() => handleCopyPhone(business.whatsapp_number!)}
          className="text-indigo-500 text-sm font-semibold hover:text-indigo-400"
        >
          {copiedPhone === business.whatsapp_number ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
    </div>
  );
}
