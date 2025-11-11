// src/components/Configuracoes/FormPagamentos.tsx
import React, { useState } from 'react';
import { ChevronLeft, CreditCard } from 'lucide-react';
import { SiNubank } from "react-icons/si";
import { SiPicpay } from "react-icons/si";


// 1. DEFINIMOS OS NOSSOS "ESTADOS DE TELA"
type ViewState = 'list' | 'addMenu' | 'addCardForm';

export function FormPagamentos() {
  // 2. O CÉREBRO: O 'useState' QUE CONTROLA A TELA ATIVA
  // Começamos na tela 'list'
  const [view, setView] = useState<ViewState>('list');

  // Função para "Voltar" (um helper)
  const handleBack = () => {
    if (view === 'addCardForm') {
      setView('addMenu'); // Se está no form do cartão, volta pro menu
    } else if (view === 'addMenu') {
      setView('list'); // Se está no menu, volta pra lista
    }
  };

  // 3. O "ROTEADOR" DE TELAS
  // Um helper para renderizar a tela correta
  const renderView = () => {
    switch (view) {
      // ----------------------------------------------------
      // TELA 1: "Opções de pagamento" (A lista)
      // ----------------------------------------------------
      case 'list':
        return (
          <>
            <h2 className="text-2xl font-bold text-zinc-100 mb-8">
              Opções de pagamento
            </h2>
            {/* Lista de itens (exemplo) */}
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-zinc-700 bg-zinc-700 p-4">
                <span className="text-sm text-zinc-100">Mastercard **** 3605</span>
              </div>
              {/* Botão para ir para a TELA 2 */}
              <button
                onClick={() => setView('addMenu')}
                className="mt-4 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Adicionar forma de pagamento
              </button>
            </div>
          </>
        );

      // ----------------------------------------------------
      // TELA 2: "Adicionar forma de pagamento" (O menu)
      // ----------------------------------------------------
      case 'addMenu':
        return (
          <>
            <button onClick={handleBack} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 mb-6">
              <ChevronLeft className="h-4 w-4" />
              Opções de pagamento
            </button>
            <h2 className="text-2xl font-bold text-zinc-100 mb-8">
              Adicionar forma de pagamento
            </h2>
            {/* Lista de opções */}
            <div className="flex flex-col divide-y divide-zinc-700 border-t border-b border-zinc-700">
              {/* Botão para ir para a TELA 3 */}
              <button
                onClick={() => setView('addCardForm')}
                className="flex items-center gap-4 p-4 text-zinc-100 hover:bg-zinc-700 w-full">
                <CreditCard className="h-5 w-5" />
                <span>Cartão de crédito ou débito</span>
              </button>
              <button
                // onClick={() => setView('addCardForm')}
                className="flex items-center gap-4 p-4 text-violet-600 hover:bg-zinc-700 w-full">
                <SiNubank className="h-5 w-5" />
                <span>Nubank</span>
              </button>
              <button
                // onClick={() => setView('addCardForm')}
                className="flex items-center gap-4 p-4 text-green-600 hover:bg-zinc-700 w-full">
                <SiPicpay className="h-5 w-5" />
                <span>Picpay</span>
              </button>
            </div>
          </>
        );

      // ----------------------------------------------------
      // TELA 3: "Adicione um cartão" (O formulário)
      // ----------------------------------------------------
      case 'addCardForm':
        return (
          <>
            <button onClick={handleBack} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 mb-6">
              <ChevronLeft className="h-4 w-4" />
              Adicionar forma de pagamento
            </button>
            <h2 className="text-2xl font-bold text-zinc-100 mb-8">
              Adicione um cartão
            </h2>
            {/* Formulário (baseado no seu 'FormMeusDados') */}
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Número do cartão
                </label>
                <input type="text" className="w-full rounded-md border-zinc-700 bg-zinc-700 p-3 text-zinc-100" />
              </div>
              {/* Grid para Validade e CVV (como você aprendeu) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Validade
                  </label>
                  <input type="text" placeholder="MM/AA" className="w-full rounded-md border-zinc-700 bg-zinc-700 p-3 text-zinc-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    CVV
                  </label>
                  <input type="text" placeholder="123" className="w-full rounded-md border-zinc-700 bg-zinc-700 p-3 text-zinc-100" />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Salvar
              </button>
            </form>
          </>
        );

    }
  };

  // 4. O RENDER FINAL
  // Retornamos o 'div' principal que apenas renderiza a tela correta.
  return (
    <div className="w-full max-w-lg">
      {renderView()}
    </div>
  );
}