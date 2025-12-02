import { UploadCloud, X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  preview: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  isLoading?: boolean;
}

/**
 * Componente de upload de imagem reutilizável
 * Responsabilidade: Apresentação do upload de imagem
 */
export function ImageUpload({ 
  label, 
  preview, 
  onUpload, 
  onRemove,
  isLoading = false 
}: ImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-200 mb-2">
        {label}
      </label>
      <div className="flex items-start gap-4">
        {/* Preview da Imagem */}
        {preview ? (
          <div className="relative w-32 h-32 bg-zinc-800 rounded-lg border-2 border-zinc-700 overflow-hidden group">
            <img 
              src={preview} 
              alt={`${label} preview`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={onRemove}
              disabled={isLoading}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-zinc-600" />
          </div>
        )}

        {/* Botão de Upload */}
        <div className="flex-1">
          <label 
            htmlFor={`${label}-upload`}
            className={`inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors text-sm font-medium ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <UploadCloud size={18} />
            {isLoading ? 'Enviando...' : preview ? 'Alterar Imagem' : 'Fazer Upload'}
          </label>
          <input
            id={`${label}-upload`}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
          />
          <p className="text-xs text-zinc-400 mt-2">
            PNG, JPG ou WEBP. Máx. 2MB.
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Recomendado: 512x512px (formato quadrado)
          </p>
        </div>
      </div>
    </div>
  );
}
