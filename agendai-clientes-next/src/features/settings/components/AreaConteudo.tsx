'use client';

import { FormMeusDados } from "./forms/FormMeusDados";
import { FormSeguranca } from "./forms/FormSeguranca";
import { FormTermos } from "./forms/FormTermos";
import { FormFavoritos } from "./forms/FormFavoritos";
import type { AbaAtiva } from '../types';

interface AreaConteudoProps {
  abaAtiva: AbaAtiva;
  onNavigateToTermos?: (tipo: 'termos' | 'privacidade') => void;
}

export function AreaConteudo({ abaAtiva, onNavigateToTermos }: AreaConteudoProps) {
  switch (abaAtiva) {
    case 'meus-dados':
      return <FormMeusDados/>;
    case 'seguranca':
      return <FormSeguranca/>;
    case 'termos':
      return <FormTermos onNavigateToTermos={onNavigateToTermos} />;
    case 'favoritos':
      return <FormFavoritos/>;
    default:
      return <FormMeusDados />;
  }
}
