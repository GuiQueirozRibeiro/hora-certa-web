'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MapPin, Save, Truck } from 'lucide-react';
import { useAddressForm } from '@/hooks/useAddressForm';

export function FormEndereco() {
  const {
    homeServiceOnly, setHomeServiceOnly,
    country, state, city, neighborhood, street, number, complement, postalCode,
    isSaving, isLoading,
    setCountry, setState, setCity, setNeighborhood, setStreet, setNumber, setComplement, setPostalCode,
    handleSubmit, handleCepBlur, formatCep,
  } = useAddressForm();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-zinc-400">Carregando endereço...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-100 mb-1 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-indigo-500" />
          Endereço da Empresa
        </h2>
        <p className="text-sm text-zinc-400">
          Configure se possui local fixo ou se atende apenas em domicílio.
        </p>
      </div>

      <div className="mb-8 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Truck className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-zinc-100">Atendimento apenas em domicílio</h4>
            <p className="text-xs text-zinc-500 hidden sm:block">Sua empresa não possui sede física para clientes.</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={homeServiceOnly}
            onChange={(e) => setHomeServiceOnly(e.target.checked)}
          />
          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {homeServiceOnly ? (
          <div className="py-8 px-4 border-2 border-dashed border-zinc-700 rounded-xl text-center">
            <p className="text-zinc-400 text-sm">
              Você marcou que sua empresa atende apenas em domicílio. <br />
              O endereço físico não será exibido para os clientes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
                <Input
                  label="Estado de Atuação *"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
                <Input
                  label="Cidade de Atuação *"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="CEP *"
                  placeholder="00000-000"
                  value={postalCode}
                  onChange={(e) => setPostalCode(formatCep(e.target.value))}
                  onBlur={handleCepBlur}
                  maxLength={9}
                  required
                />
                <p className="mt-1 text-xs text-zinc-500">
                  💡 Digite o CEP para preencher automaticamente
                </p>
              </div>
              <Input
                label="País *"
                placeholder="Brasil"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Estado *"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
              <Input
                label="Cidade *"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <Input
              label="Bairro"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Rua *"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>
              <Input
                label="Número *"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>

            <Input
              label="Complemento"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />
          </>
        )}

        <div className="flex gap-3 pt-4 border-t border-zinc-700">
          <Button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 w-full md:w-auto"
          >
            <Save size={16} />
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </div>
  );
}