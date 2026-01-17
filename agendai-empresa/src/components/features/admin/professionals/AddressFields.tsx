// src/components/features/professionals/AddressFields.tsx
'use client';

import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface AddressFieldsProps {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  onStreetChange: (value: string) => void;
  onNumberChange: (value: string) => void;
  onComplementChange: (value: string) => void;
  onNeighborhoodChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onZipCodeChange: (value: string) => void;
}

export function AddressFields({
  street,
  number,
  complement,
  neighborhood,
  city,
  state,
  zipCode,
  onStreetChange,
  onNumberChange,
  onComplementChange,
  onNeighborhoodChange,
  onCityChange,
  onStateChange,
  onZipCodeChange,
}: AddressFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-700">
        <MapPin className="h-4 w-4 text-indigo-400" />
        <h3 className="text-sm font-medium text-zinc-200">
          Endereço para Atendimento Domiciliar
        </h3>
        <span className="text-xs text-zinc-500">(Opcional)</span>
      </div>

      {/* CEP */}
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-2">
          CEP
        </label>
        <Input
          type="text"
          placeholder="00000-000"
          value={zipCode}
          onChange={(e) => {
            // Formata CEP automaticamente
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
              value = value.slice(0, 5) + '-' + value.slice(5, 8);
            }
            onZipCodeChange(value);
          }}
          maxLength={9}
        />
      </div>

      {/* Rua e Número */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-200 mb-2">
            Rua
          </label>
          <Input
            type="text"
            placeholder="Nome da rua"
            value={street}
            onChange={(e) => onStreetChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-200 mb-2">
            Número
          </label>
          <Input
            type="text"
            placeholder="123"
            value={number}
            onChange={(e) => onNumberChange(e.target.value)}
          />
        </div>
      </div>

      {/* Complemento */}
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-2">
          Complemento
        </label>
        <Input
          type="text"
          placeholder="Apto, bloco, etc. (opcional)"
          value={complement}
          onChange={(e) => onComplementChange(e.target.value)}
        />
      </div>

      {/* Bairro */}
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-2">
          Bairro
        </label>
        <Input
          type="text"
          placeholder="Nome do bairro"
          value={neighborhood}
          onChange={(e) => onNeighborhoodChange(e.target.value)}
        />
      </div>

      {/* Cidade e Estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-200 mb-2">
            Cidade
          </label>
          <Input
            type="text"
            placeholder="Nome da cidade"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-200 mb-2">
            Estado
          </label>
          <select
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          >
            <option value="">Selecione</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <p className="text-xs text-blue-300">
          💡 <strong>Dica:</strong> O endereço é opcional e será usado apenas se o profissional 
          realizar atendimentos domiciliares. Você pode deixar em branco se o profissional 
          atende apenas no estabelecimento.
        </p>
      </div>
    </div>
  );
}