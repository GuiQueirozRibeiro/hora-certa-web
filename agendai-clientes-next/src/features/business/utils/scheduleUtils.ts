// Utilitários de horário de funcionamento
// Seguindo o princípio de Single Responsibility (SRP)

import { BusinessSchedule, ParsedSchedule } from '../types';
import { getDayOfWeek, normalizeString } from './formatters';

/**
 * Converte string de horário (HH:MM) para minutos desde meia-noite
 */
const parseTimeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Verifica se o estabelecimento está aberto no momento atual
 */
export const isCurrentlyOpen = (schedule: BusinessSchedule): boolean => {
  if (!schedule.ativo) return false;
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const openTime = parseTimeToMinutes(schedule.horarioAbertura);
  const closeTime = parseTimeToMinutes(schedule.horarioFechamento);
  
  // Se tem intervalo, verificar se está no horário de funcionamento (manhã ou tarde)
  if (schedule.intervaloInicio && schedule.intervaloFim) {
    const intervalStart = parseTimeToMinutes(schedule.intervaloInicio);
    const intervalEnd = parseTimeToMinutes(schedule.intervaloFim);
    
    return (currentTime >= openTime && currentTime < intervalStart) || 
           (currentTime >= intervalEnd && currentTime < closeTime);
  }
  
  // Sem intervalo, só verificar se está entre abertura e fechamento
  return currentTime >= openTime && currentTime < closeTime;
};

/**
 * Processa os horários de funcionamento para exibição
 */
export const getOpeningHours = (openingHours: BusinessSchedule[] | undefined): ParsedSchedule[] => {
  if (!openingHours || !Array.isArray(openingHours)) return [];
  
  const currentDay = getDayOfWeek();
  
  return openingHours.map((schedule) => {
    const hasInterval = !!(schedule.intervaloInicio && schedule.intervaloFim);
    let hours = 'Fechado';
    
    if (schedule.ativo) {
      if (hasInterval) {
        hours = `${schedule.horarioAbertura} - ${schedule.intervaloInicio} | ${schedule.intervaloFim} - ${schedule.horarioFechamento}`;
      } else {
        hours = `${schedule.horarioAbertura} - ${schedule.horarioFechamento}`;
      }
    }
    
    const isToday = normalizeString(schedule.dia) === normalizeString(currentDay);
    
    return {
      day: schedule.dia,
      hours,
      isOpen: schedule.ativo,
      isToday,
      hasInterval,
      schedule,
    };
  });
};

/**
 * Verifica se o estabelecimento está aberto agora
 */
export const checkIsOpenNow = (openingHours: BusinessSchedule[] | undefined): boolean => {
  const schedules = getOpeningHours(openingHours);
  const todaySchedule = schedules.find(s => s.isToday);
  
  if (!todaySchedule?.schedule) return false;
  
  return isCurrentlyOpen(todaySchedule.schedule);
};
