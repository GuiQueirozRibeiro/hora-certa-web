'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/SupabaseClient';

export const useAppointmentActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const cancelAppointment = async (appointmentId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  const completeAppointment = async (appointmentId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', appointmentId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    cancelAppointment,
    completeAppointment,
  };
};
