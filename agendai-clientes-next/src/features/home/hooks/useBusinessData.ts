'use client';

import { useMemo } from 'react';

export interface Business {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  imagem: string;
  telefones: string[];
  formasPagamento: string[];
  horariosFuncionamento: { dia: string; horario: string }[];
  localizacao: { lat: number; lng: number };
}

export const useBusinessData = (rawBusinesses: any[]) => {
  const transformedBusinesses = useMemo(() => {
    if (!rawBusinesses || !rawBusinesses.length) {
      return [];
    }

    return rawBusinesses.map((business): Business => {
      const address = business.address;
      const addressString = address
        ? `${address.street_address || ''}, ${address.number || ''} - ${address.neighborhood || ''}, ${address.city || ''}`
        : 'Endereço não disponível';

      const horariosFuncionamento = business.opening_hours && Array.isArray(business.opening_hours)
        ? business.opening_hours.map((schedule) => {
            const hasInterval = schedule.intervaloInicio && schedule.intervaloFim;
            let horario = 'Fechado';
            if (schedule.ativo) {
              if (hasInterval) {
                horario = `${schedule.horarioAbertura} - ${schedule.intervaloInicio} | ${schedule.intervaloFim} - ${schedule.horarioFechamento}`;
              } else {
                horario = `${schedule.horarioAbertura} - ${schedule.horarioFechamento}`;
              }
            }
            return {
              dia: schedule.dia,
              horario: horario,
            };
          })
        : [
            { dia: "Segunda-feira", horario: "09:00 - 21:00" },
            { dia: "Terça-feira", horario: "09:00 - 21:00" },
            { dia: "Quarta-feira", horario: "09:00 - 21:00" },
            { dia: "Quinta-feira", horario: "09:00 - 21:00" },
            { dia: "Sexta-feira", horario: "09:00 - 21:00" },
            { dia: "Sábado", horario: "08:00 - 17:00" },
            { dia: "Domingo", horario: "Fechado" },
          ];

      return {
        id: business.id,
        nome: business.name,
        endereco: addressString,
        horario: "08:00 as 18:00",
        imagem: business.cover_image_url || business.image_url || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop",
        telefones: business.whatsapp_link ? [business.whatsapp_link] : ["Telefone não disponível"],
        formasPagamento: ["Dinheiro", "Cartão de crédito", "Cartão de débito", "Pix"],
        horariosFuncionamento,
        localizacao: { lat: -15.7942, lng: -47.8822 },
      };
    });
  }, [rawBusinesses]);

  return transformedBusinesses;
};
