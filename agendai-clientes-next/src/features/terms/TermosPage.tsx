'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TermosDeServico } from './components/TermosDeServico';
import { PoliticaPrivacidade } from './components/PoliticaPrivacidade';

interface TermosPageProps {
  tipo?: 'termos' | 'privacidade';
  onClose?: () => void;
}

const TermosPage: React.FC<TermosPageProps> = ({ tipo = 'termos', onClose }) => {
  return (
    <div className="min-h-screen bg-[#26272B] text-white">
      {/* Header fixo */}
      <div className="sticky top-0 z-10 bg-[#1a1b1e] border-b border-zinc-800 px-8 py-4 flex items-center justify-between">
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
        )}
        {!onClose && <div className="w-20"></div>}
        <h1 className="text-xl font-bold">
          <span className={tipo === 'termos' ? 'text-indigo-500' : 'text-green-500'}>
            {tipo === 'termos' ? 'Termos de Serviço' : 'Política de Privacidade'}
          </span>
        </h1>
        <div className="w-20"></div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-[#1f1f1f] rounded-lg p-8">
          {tipo === 'termos' ? <TermosDeServico /> : <PoliticaPrivacidade />}
        </div>

        {/* Botão de volta no final - apenas se onClose foi fornecido */}
        {onClose && (
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className={`${
                tipo === 'termos' ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-green-500 hover:bg-green-600'
              } text-white font-semibold px-8 py-3 rounded-lg transition-colors`}
            >
              Voltar para Configurações
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermosPage;
