// src/components/features/agenda/AppointmentModal.tsx
'use client';

import { useEffect } from 'react';
import { X, Calendar, Clock, User, Scissors, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAppointmentModal } from '@/hooks/useAppointmentsModal';

interface AppointmentModalProps {
  businessId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: string;
}

export function AppointmentModal({
  businessId,
  isOpen,
  onClose,
  onSuccess,
  initialDate,
}: AppointmentModalProps) {
  const {
    clientName,
    selectedProfessional,
    selectedService,
    appointmentDate,
    appointmentTime,
    notes,
    professionals,
    services,
    selectedServiceData,
    isLoading,
    isSaving,
    setClientName,
    setSelectedProfessional,
    setSelectedService,
    setAppointmentDate,
    setAppointmentTime,
    setNotes,
    handleSubmit,
  } = useAppointmentModal({ businessId, onSuccess: () => { onSuccess(); onClose(); } });

  // Set initial date if provided
  useEffect(() => {
    if (initialDate && !appointmentDate) {
      setAppointmentDate(initialDate);
    }
  }, [initialDate, appointmentDate, setAppointmentDate]);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-zinc-800 rounded-t-2xl md:rounded-xl border border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-zinc-700 bg-zinc-800 sticky top-0 z-10 shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-400" />
            Novo Agendamento
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleFormSubmit} className="p-4 md:p-6 space-y-6 overflow-y-auto">
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {/* Client Name */}
              <div>
                <label className="text-sm font-medium text-zinc-200 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-zinc-400" />
                  Nome do Cliente *
                </label>
                <Input
                  type="text"
                  placeholder="Digite o nome do cliente"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>

              {/* Professional Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Profissional *
                </label>
                <select
                  value={selectedProfessional}
                  onChange={(e) => setSelectedProfessional(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="">Selecione um profissional</option>
                  {professionals.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.user?.name || prof.specialties?.[0] || 'Profissional'}
                    </option>
                  ))}
                </select>
                {professionals.length === 0 && (
                  <p className="text-xs text-yellow-400 mt-1">
                    ⚠️ Nenhum profissional ativo encontrado
                  </p>
                )}
              </div>

              {/* Service Selection */}
              <div>
                <label className="text-sm font-medium text-zinc-200 mb-2 flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-zinc-400" />
                  Serviço *
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="">Selecione um serviço</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - R$ {service.price.toFixed(2)} ({service.duration_minutes}min)
                    </option>
                  ))}
                </select>
                {services.length === 0 && (
                  <p className="text-xs text-yellow-400 mt-1">
                    ⚠️ Nenhum serviço ativo encontrado
                  </p>
                )}
              </div>

              {/* Service Details */}
              {selectedServiceData && (
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg shrink-0">
                      <DollarSign className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-indigo-300 mb-1">
                        Detalhes do Serviço
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                        <div>
                          <span className="text-zinc-500">Duração:</span>{' '}
                          {selectedServiceData.duration_minutes} minutos
                        </div>
                        <div>
                          <span className="text-zinc-500">Valor:</span>{' '}
                          R$ {selectedServiceData.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-200 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-zinc-400" />
                    Data *
                  </label>
                  <Input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-200 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-zinc-400" />
                    Horário *
                  </label>
                  <Input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Observações
                </label>
                <Textarea
                  placeholder="Informações adicionais sobre o agendamento..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row gap-3 pt-4 border-t border-zinc-700">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="bg-zinc-700 hover:bg-zinc-600 w-full md:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving || isLoading}
              className="flex-1 w-full md:w-auto"
            >
              {isSaving ? 'Criando agendamento...' : 'Criar Agendamento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}