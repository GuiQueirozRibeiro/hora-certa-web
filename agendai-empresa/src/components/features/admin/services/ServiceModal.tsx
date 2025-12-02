import { useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { useServiceForm } from '@/hooks/useServiceForm';
import { serviceService } from '@/services/serviceService';
import { validateServiceForm } from '@/lib/validations/serviceValidations';
import { mapServiceToFormData, sanitizeServiceFormData } from '@/lib/mappers/serviceMapper';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import type { Service } from '@/types/service';

interface ServiceModalProps {
  businessId: string;
  service: Service | null;
  onClose: (saved: boolean) => void;
}

export function ServiceModal({ businessId, service, onClose }: ServiceModalProps) {
  const { success, error: showError } = useToast();
  const isEditing = !!service;

  const {
    state,
    updateField,
    setErrors,
    clearErrors,
    setSaving,
    resetForm,
    getFieldError,
  } = useServiceForm({
    name: '',
    description: '',
    duration_minutes: 30,
    price: 0,
    category: '',
    is_active: true,
  });

  // Carrega dados ao editar
  useEffect(() => {
    if (service) {
      const formData = mapServiceToFormData(service);
      resetForm(formData);
    }
  }, [service, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    clearErrors();
    const validationErrors = validateServiceForm(state.data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      showError('Erro de validação', 'Verifique os campos destacados');
      return;
    }

    // Salvar
    setSaving(true);
    try {
      const sanitizedData = sanitizeServiceFormData(state.data);

      if (isEditing) {
        await serviceService.updateService(service.id, sanitizedData);
        success('Serviço atualizado com sucesso!');
      } else {
        await serviceService.createService(businessId, sanitizedData);
        success('Serviço criado com sucesso!');
      }

      onClose(true);
    } catch (err: any) {
      showError('Erro ao salvar', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800 rounded-xl border border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome */}
          <Input
            label="Nome do Serviço *"
            placeholder="Ex: Corte Masculino"
            type="text"
            value={state.data.name}
            onChange={(e) => updateField('name', e.target.value)}
            error={getFieldError('name')}
            required
          />

          {/* Categoria */}
          <Input
            label="Categoria"
            placeholder="Ex: Cabelo, Barba, Tratamento"
            type="text"
            value={state.data.category || ''}
            onChange={(e) => updateField('category', e.target.value)}
            error={getFieldError('category')}
          />

          {/* Duração e Preço */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duração (minutos) *"
              placeholder="30"
              type="number"
              min="5"
              max="480"
              value={state.data.duration_minutes}
              onChange={(e) => updateField('duration_minutes', Number(e.target.value))}
              error={getFieldError('duration_minutes')}
              required
            />
            <Input
              label="Preço (R$) *"
              placeholder="50.00"
              type="number"
              min="0"
              step="0.01"
              value={state.data.price}
              onChange={(e) => updateField('price', Number(e.target.value))}
              error={getFieldError('price')}
              required
            />
          </div>

          {/* Descrição */}
          <Textarea
            label="Descrição"
            placeholder="Descreva o serviço..."
            rows={4}
            value={state.data.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            error={getFieldError('description')}
          />

          {/* Status Ativo */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={state.data.is_active}
              onChange={(e) => updateField('is_active', e.target.checked)}
              className="w-4 h-4 bg-zinc-800 border-zinc-600 rounded text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900"
            />
            <label htmlFor="is_active" className="text-sm text-zinc-300">
              Serviço ativo (disponível para agendamento)
            </label>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={state.isSaving}
              className="flex-1"
            >
              {state.isSaving
                ? 'Salvando...'
                : isEditing
                ? 'Salvar Alterações'
                : 'Criar Serviço'}
            </Button>
            <Button
              type="button"
              onClick={() => onClose(false)}
              disabled={state.isSaving}
              className="bg-zinc-700 hover:bg-zinc-600"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
