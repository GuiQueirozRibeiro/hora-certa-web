import { Edit2, Trash2, Power } from 'lucide-react';
import { formatPrice, formatDuration } from '@/lib/mappers/serviceMapper';
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
        <div
          key={service.id}
          className={`bg-zinc-900 rounded-lg border ${
            service.is_active ? 'border-zinc-700' : 'border-red-900/50'
          } p-4 hover:border-indigo-500 transition-colors`}
        >
          {/* Cabeçalho */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                {service.name}
              </h3>
              {service.category && (
                <span className="inline-block px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded">
                  {service.category}
                </span>
              )}
            </div>
            <button
              onClick={() => onToggleStatus(service.id, service.is_active)}
              className={`p-2 rounded-lg transition-colors ${
                service.is_active
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              }`}
              title={service.is_active ? 'Desativar serviço' : 'Ativar serviço'}
            >
              <Power size={16} />
            </button>
          </div>

          {/* Descrição */}
          {service.description && (
            <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
              {service.description}
            </p>
          )}

          {/* Info */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-400 text-sm">
              {formatDuration(service.duration_minutes)}
            </span>
            <span className="text-lg font-bold text-green-400">
              {formatPrice(service.price)}
            </span>
          </div>

          {/* Ações */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(service)}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"
            >
              <Edit2 size={14} />
              Editar
            </button>
            <button
              onClick={() => onDelete(service.id)}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
