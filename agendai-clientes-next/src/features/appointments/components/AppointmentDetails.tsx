'use client';

import React from 'react';
import type { AppointmentWithDetails } from '../../../types/types';

interface AppointmentDetailsProps {
  appointment: AppointmentWithDetails;
  copiedPhone: string | null;
  isProcessing: boolean;
  formatDate: (date: string) => { day: number; month: string };
  formatTime: (time: string) => string;
  formatPhoneNumber: (phone: string) => string;
  onCopyPhone: (phone: string) => void;
  onCancel: () => void;
  onComplete: () => void;
}

export const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  copiedPhone,
  isProcessing,
  formatDate,
  formatTime,
  formatPhoneNumber,
  onCopyPhone,
  onCancel,
  onComplete,
}) => {
  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6">
      {/* Mapa */}
      <div className="mb-6">
        {appointment.business?.address?.street_address ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${appointment.business.address.street_address}, ${appointment.business.address.number || ''} ${appointment.business.address.neighborhood || ''} ${appointment.business.address.city || ''}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full h-48 bg-[#2a2a2a] rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group"
          >
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0, pointerEvents: "none" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${appointment.business.address.street_address}, ${appointment.business.address.number || ''} ${appointment.business.address.neighborhood || ''} ${appointment.business.address.city || ''}`
              )}&z=16&output=embed`}
              className="absolute inset-0"
            ></iframe>
            <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors pointer-events-none"></div>
          </a>
        ) : (
          <div className="w-full h-48 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Mapa não disponível</p>
          </div>
        )}
        
        {/* Informações da empresa */}
        <div className="flex items-center gap-3 mt-4">
          <img
            src={appointment.business?.image_url || 
                 appointment.business?.cover_image_url || 
                 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=80&h=80&fit=crop'}
            alt={appointment.business?.name || 'Estabelecimento'}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-white font-bold text-base">
              {appointment.business?.name || 'Estabelecimento'}
            </h2>
            <p className="text-gray-400 text-xs">
              {appointment.business?.address?.street_address ? 
                `${appointment.business.address.street_address}, ${appointment.business.address.number || ''} - ${appointment.business.address.neighborhood || ''}, ${appointment.business.address.city || ''}` :
                'Endereço não disponível'}
            </p>
          </div>
        </div>
      </div>

      {/* Sobre nós */}
      <div className="mb-6">
        <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">
          Sobre nós
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Bem-vindo à {appointment.business?.name || 'nosso estabelecimento'}, onde tradição encontra estilo. 
          Neste espaço acolhedor e refinado, oferecemos serviços de barbearia com um toque de 
          modernidade. Nossa equipe de profissionais especializados está pronta para proporcionar 
          a você uma experiência única e personalizada.
        </p>
      </div>

      {/* Contato */}
      <div className="mb-6">
        {appointment.business?.whatsapp_link && (
          <>
            <a
              href={appointment.business.whatsapp_link.includes('wa.me') 
                ? appointment.business.whatsapp_link 
                : `https://wa.me/${appointment.business.whatsapp_link.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors w-full mb-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Entrar em contato
            </a>

            {/* Telefone */}
            <div className="flex items-center justify-between bg-[#0d0d0d] rounded-lg p-4 border border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <span className="text-white text-sm">
                  {formatPhoneNumber(appointment.business.whatsapp_link)}
                </span>
              </div>
              <button
                onClick={() => onCopyPhone(appointment.business!.whatsapp_link!)}
                className="text-indigo-500 text-sm font-semibold hover:text-indigo-400"
              >
                {copiedPhone === appointment.business!.whatsapp_link ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Detalhes do serviço */}
      <div className="bg-[#0d0d0d] rounded-lg p-5 border border-[#2a2a2a] mb-6">
        <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
          Confirmado
        </h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-white font-semibold text-base mb-2">
              {appointment.service_name || 'Corte de Cabelo'}
            </h4>
            <div className="text-gray-400 text-xs space-y-1">
              <p>Data: {formatDate(appointment.appointment_date).day} de {formatDate(appointment.appointment_date).month}</p>
              <p>Horário: {formatTime(appointment.appointment_time)}</p>
              <p>Barbearia: {appointment.business?.name || 'Não informado'}</p>
            </div>
          </div>
          <div className="pt-3 border-t border-[#2a2a2a] flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total</span>
            <span className="text-white font-bold text-lg">
              R${Number(appointment.total_price || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {isProcessing ? 'Processando...' : 'Cancelar Agendamento'}
        </button>
        <button
          onClick={onComplete}
          disabled={isProcessing}
          className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {isProcessing ? 'Processando...' : 'Marcar como Finalizado'}
        </button>
      </div>
    </div>
  );
};
