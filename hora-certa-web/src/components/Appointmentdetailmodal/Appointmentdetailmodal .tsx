import React from 'react';
import type { AppointmentWithDetails } from '../../types/types';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentWithDetails | null;
  onCancel: (id: string) => void;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onCancel,
}) => {
  if (!isOpen || !appointment) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: { text: 'Confirmado', color: 'bg-green-500' },
      confirmed: { text: 'Confirmado', color: 'bg-green-500' },
      cancelled: { text: 'Cancelado', color: 'bg-red-500' },
      completed: { text: 'Finalizado', color: 'bg-gray-500' },
      no_show: { text: 'Não Compareceu', color: 'bg-orange-500' },
    };
    return badges[status] || badges.scheduled;
  };

  const statusBadge = getStatusBadge(appointment.status);
  const businessName = appointment.business?.name || 'Estabelecimento';
  const businessImage = appointment.business?.image_url || appointment.business?.cover_image_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop';
  const businessAddress = appointment.business?.address
    ? `${appointment.business.address.street_address || ''}, ${appointment.business.address.number || ''} - ${appointment.business.address.city || ''}`
    : 'Endereço não disponível';

  const handleCancelAppointment = () => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      onCancel(appointment.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#1a1a1a] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagem do estabelecimento */}
        <div className="relative h-48 w-full">
          <img
            src={businessImage}
            alt={businessName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

          {/* Botão de voltar */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" />
            </svg>
          </button>

          {/* Nome e badge de status */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-white">{businessName}</h2>
              <span className={`${statusBadge.color} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                {statusBadge.text}
              </span>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Sobre nós */}
          <div className="mb-6">
            <h3 className="text-white font-semibold text-base mb-3 uppercase tracking-wider">
              Sobre nós
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bem-vindo ao {businessName}, onde tradição encontra estilo. Nosso espaço oferece
              serviços de alta qualidade com profissionais especializados.
            </p>
          </div>

          {/* Contato */}
          {appointment.business?.whatsapp_link && (
            <div className="mb-6">
              <a
                href={appointment.business.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                (15) 99332-5129
              </a>
            </div>
          )}

          {/* Informações do agendamento */}
          <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold text-sm mb-3">Detalhes do Agendamento</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Serviço</span>
                <span className="text-white font-medium">
                  {appointment.service_name || 'Corte de Cabelo'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Data</span>
                <span className="text-white font-medium">
                  {formatDate(appointment.appointment_date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Horário</span>
                <span className="text-white font-medium">
                  {formatTime(appointment.appointment_time)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duração</span>
                <span className="text-white font-medium">
                  {appointment.duration_minutes} minutos
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-700">
                <span className="text-gray-400">Total</span>
                <span className="text-white font-bold text-base">
                  R$ {Number(appointment.total_price).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="mb-6">
            <p className="text-white font-semibold text-sm mb-1">{businessName}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <span>📍</span>
              {businessAddress}
            </p>
          </div>

          {/* Botão de cancelar (apenas se não estiver cancelado ou finalizado) */}
          {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
            <button
              onClick={handleCancelAppointment}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Cancelar Reserva
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;