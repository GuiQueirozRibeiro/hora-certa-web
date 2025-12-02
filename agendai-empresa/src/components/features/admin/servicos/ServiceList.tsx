import { ServicoCard } from './ServicoCard';
import type { Service } from '@/types/service';

interface ServiceListProps {
  services: Service[];
  loading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
  onToggleStatus: (serviceId: string, currentStatus: boolean) => void;
}

export function ServiceList({ services, loading, onEdit, onDelete, onToggleStatus }: ServiceListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-700 p-4 animate-pulse">
            <div className="h-6 bg-zinc-800 rounded mb-2"></div>
            <div className="h-4 bg-zinc-800 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-12 text-center">
        <p className="text-zinc-500 mb-2">Nenhum serviço encontrado</p>
        <p className="text-sm text-zinc-600">
          Clique em "Adicionar Serviço" para começar
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <ServicoCard
          key={service.id}
          servico={service}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}
