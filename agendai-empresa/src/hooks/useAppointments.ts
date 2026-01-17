/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useAppointmentModal.ts
import { useState, useCallback, useEffect } from 'react';
import { useToast } from './useToast';
import { appointmentService } from '@/services/appointmentService';
import { professionalService } from '@/services/professionalService';
import { serviceService } from '@/services/serviceService';
import type { ProfessionalWithUser } from '@/types/professional';
import type { Service } from '@/types/service';

interface UseAppointmentModalProps {
  businessId: string;
  onSuccess: () => void;
}

export function useAppointmentModal({ businessId, onSuccess }: UseAppointmentModalProps) {
  const { success, error: showError } = useToast();

  // Form state
  const [clientName, setClientName] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');

  // Data state
  const [professionals, setProfessionals] = useState<ProfessionalWithUser[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load professionals and services
  useEffect(() => {
    async function loadData() {
      if (!businessId) return;

      setIsLoading(true);
      try {
        const [profData, serviceData] = await Promise.all([
          professionalService.getProfessionalsByBusinessId(businessId),
          serviceService.getServicesByBusinessId(businessId),
        ]);

        setProfessionals(profData.filter(p => p.is_active));
        setServices(serviceData.filter(s => s.is_active));
      } catch (err: any) {
        showError('Erro ao carregar dados', err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [businessId, showError]);

  // Get selected service data
  const selectedServiceData = services.find(s => s.id === selectedService);

  // Validation
  const validateForm = useCallback((): string | null => {
    if (!clientName.trim()) {
      return 'Nome do cliente é obrigatório';
    }
    if (!selectedProfessional) {
      return 'Selecione um profissional';
    }
    if (!selectedService) {
      return 'Selecione um serviço';
    }
    if (!appointmentDate) {
      return 'Selecione uma data';
    }
    if (!appointmentTime) {
      return 'Selecione um horário';
    }
    return null;
  }, [clientName, selectedProfessional, selectedService, appointmentDate, appointmentTime]);

  // Submit
  const handleSubmit = useCallback(async () => {
    if (isSaving) return false;

    const validationError = validateForm();
    if (validationError) {
      showError('Erro de validação', validationError);
      return false;
    }

    setIsSaving(true);
    try {
      await appointmentService.createAppointment({
        business_id: businessId,
        professional_id: selectedProfessional,
        service_id: selectedService,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        duration_minutes: selectedServiceData?.duration_minutes || 30,
        total_price: selectedServiceData?.price || 0,
        status: 'confirmed',
        notes: notes.trim() || undefined,
        client_name: clientName.trim(),
      });

      success('Agendamento criado com sucesso!');
      onSuccess();
      
      // Reset form
      setClientName('');
      setSelectedProfessional('');
      setSelectedService('');
      setAppointmentDate('');
      setAppointmentTime('');
      setNotes('');
      
      return true;
    } catch (err: any) {
      showError('Erro ao criar agendamento', err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    businessId,
    clientName,
    selectedProfessional,
    selectedService,
    appointmentDate,
    appointmentTime,
    notes,
    selectedServiceData,
    isSaving,
    validateForm,
    success,
    showError,
    onSuccess,
  ]);

  return {
    // Form state
    clientName,
    selectedProfessional,
    selectedService,
    appointmentDate,
    appointmentTime,
    notes,
    
    // Data
    professionals,
    services,
    selectedServiceData,
    
    // Loading states
    isLoading,
    isSaving,
    
    // Setters
    setClientName,
    setSelectedProfessional,
    setSelectedService,
    setAppointmentDate,
    setAppointmentTime,
    setNotes,
    
    // Actions
    handleSubmit,
  };
}