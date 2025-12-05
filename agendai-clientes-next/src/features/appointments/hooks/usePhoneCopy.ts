/**
 * Hook para formatação de telefone
 * Single Responsibility: Apenas formatação e cópia de telefone
 */
'use client';

import { useState } from 'react';

export function usePhoneCopy() {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 13) {
      return `(${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
    } else if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  };

  const handleCopyPhone = (telefone: string) => {
    const phoneNumber = telefone.replace(/\D/g, '');
    navigator.clipboard.writeText(phoneNumber);
    setCopiedPhone(telefone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return { formatPhoneNumber, handleCopyPhone, copiedPhone };
}
