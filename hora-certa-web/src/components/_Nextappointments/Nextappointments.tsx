import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppointments } from '../../hooks/Useappointments';
import AppointmentDetailModal from '../Appointmentdetailmodal/Appointmentdetailmodal ';

const NextAppointments: React.FC = () => {
  const { user } = useAuth();
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Buscar apenas agendamentos futuros e confirmados
  const today = new Date().toISOString().split('T')[0];
  const { appointments, loading, cancelAppointment, refetch } = useAppointments({
    status: 'scheduled',
    fromDate: today,
  });

  // Pegar apenas os próximos 3 agendamentos
  const nextAppointments = appointments.slice(0, 3);

  if (!user || loading || nextAppointments.length === 0) {
    return null; // Não mostrar nada se não houver agendamentos
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    return { day, month };
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const handleOpenDetail = (appointment: AppointmentWithDetails) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleCancelAppointment = async (id: string) => {
    const result = await cancelAppointment(id);
    if (result.success) {
      await refetch();
    } else {
      alert(`Erro ao cancelar: ${result.error}`);
    }
  };

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-16 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Agendamentos</h2>
        </div>

        {/* Card de agendamento confirmado */}
        <div className="bg-[#2a2a2a] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Confirmado
            </span>
            <span className="text-white text-sm font-medium">
              {nextAppointments[0].business?.name || 'Estabelecimento'}
            </span>
          </div>

          {/* Data e horário grandes */}
          <div className="flex items-center gap-6 mb-4">
            <div className="bg-[#1a1a1a] rounded-xl px-6 py-4 text-center min-w-[100px]">
              <p className="text-sm text-gray-500 capitalize mb-1">
                {formatDate(nextAppointments[0].appointment_date).month}
              </p>
              <p className="text-4xl font-bold text-white">
                {formatDate(nextAppointments[0].appointment_date).day}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Horário</p>
              <p className="text-2xl font-bold text-white">
                {formatTime(nextAppointments[0].appointment_time)}
              </p>
            </div>
          </div>
        </div>

        {/* Grid de próximos agendamentos */}
        {nextAppointments.length > 1 && (
          <div className="grid grid-cols-4 gap-6">
            {nextAppointments.map((appointment) => {
              const date = formatDate(appointment.appointment_date);
              const businessName = appointment.business?.name || 'Estabelecimento';
              const businessImage =
                appointment.business?.image_url ||
                appointment.business?.cover_image_url ||
                'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop';

              return (
                <div
                  key={appointment.id}
                  className="bg-[#2a2a2a] rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.2)] transition-all cursor-pointer"
                  onClick={() => handleOpenDetail(appointment)}
                >
                  {/* Badge de confirmado */}
                  <div className="relative">
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                      Confirmado
                    </span>
                  </div>

                  {/* Imagem */}
                  <div className="w-full h-40 overflow-hidden relative">
                    <img src={businessImage} alt={businessName} className="w-full h-full object-cover" />
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-white mb-2 line-clamp-1">
                      {businessName}
                    </h3>

                    {/* Informações */}
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-gray-400 flex items-center gap-2">
                        <span>📍</span>
                        <span className="line-clamp-1">
                          {appointment.business?.address?.city || 'Cidade não informada'}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-2">
                        <span>✂️</span>
                        <span>{appointment.service_name || 'Corte de Cabelo'}</span>
                      </p>
                    </div>

                    {/* Data e hora */}
                    <div className="flex items-center justify-between bg-[#1a1a1a] rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#2a2a2a] rounded-lg px-3 py-2 text-center min-w-[60px]">
                          <p className="text-xs text-gray-500 capitalize">{date.month}</p>
                          <p className="text-2xl font-bold text-white">{date.day}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Horário</p>
                          <p className="text-sm font-semibold text-white">
                            {formatTime(appointment.appointment_time)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botão */}
                    <button className="w-full bg-indigo-500 rounded-lg py-3 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors mt-4">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de detalhes */}
      <AppointmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        onCancel={handleCancelAppointment}
      />
    </>
  );
};

export default NextAppointments;