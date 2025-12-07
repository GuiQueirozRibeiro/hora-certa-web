'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useBusinesses } from '../../../../hooks/Usebusinesses';
import { useFavorites } from '../../../../hooks/useFavorites';

interface Barbearia {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  imagem: string;
  telefones: string[];
  formasPagamento: string[];
  horariosFuncionamento: { dia: string; horario: string }[];
  localizacao: { lat: number; lng: number };
}

export function FormFavoritos() {
  const { businesses, loading: loadingB } = useBusinesses();
  const { favorites, loading: loadingF, error: errorF, removeFavorite } = useFavorites();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [selectedBarbearia, setSelectedBarbearia] = useState<Barbearia | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemoveFavorite = async (favoriteId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir o modal ao clicar em remover
    setRemovingId(favoriteId);
    const res = await removeFavorite(favoriteId);
    if (!res.success) {
      alert('Erro ao remover favorito: ' + (res.error || ''));
    }
    setRemovingId(null);
  };

  const convertBusinessToBarbearia = (business: typeof businesses[0]): Barbearia => {
    const addressString = 'Endereço não disponível'; // Simplificado, já que não temos address aqui
    
    const horariosFuncionamento = business.opening_hours
      ? Object.entries(business.opening_hours).map(([dia, horario]: [string, any]) => ({
          dia: dia,
          horario: horario.isClosed ? 'Fechado' : `${horario.open} - ${horario.close}`,
        }))
      : [
          { dia: "Segunda-feira", horario: "09:00 - 21:00" },
          { dia: "Terça-feira", horario: "09:00 - 21:00" },
          { dia: "Quarta-feira", horario: "09:00 - 21:00" },
          { dia: "Quinta-feira", horario: "09:00 - 21:00" },
          { dia: "Sexta-feira", horario: "09:00 - 21:00" },
          { dia: "Sábado", horario: "08:00 - 17:00" },
          { dia: "Domingo", horario: "Fechado" },
        ];

    return {
      id: business.id,
      nome: business.name,
      endereco: addressString,
      horario: "08:00 as 18:00",
      imagem: business.cover_image_url || business.image_url || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop",
      telefones: business.whatsapp_link ? [business.whatsapp_link] : ["Telefone não disponível"],
      formasPagamento: ["Dinheiro", "Cartão de crédito", "Cartão de débito", "Pix"],
      horariosFuncionamento,
      localizacao: { lat: -15.7942, lng: -47.8822 },
    };
  };

  const handleOpenModal = (business: typeof businesses[0]) => {
    const barbearia = convertBusinessToBarbearia(business);
    setSelectedBarbearia(barbearia);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBarbearia(null);
  };

  // Obter detalhes dos estabelecimentos favoritos
  const favoriteBusinesses = favorites
    .map(f => {
      const business = businesses.find(b => b.id === f.business_id);
      return business ? { favorite: f, business } : null;
    })
    .filter((item): item is { favorite: typeof favorites[0]; business: typeof businesses[0] } => item !== null);

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-2xl text-zinc-300 font-bold mb-3">Meus Favoritos</h2>
      <p className="text-zinc-300 mb-6">
        Estabelecimentos que você marcou como favoritos aparecem aqui.
      </p>

      {(loadingB || loadingF) && (
        <div className="mb-4 p-3 bg-indigo-600/10 border border-indigo-600 rounded text-indigo-300">
          Carregando...
        </div>
      )}

      {errorF && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-400">
          {errorF}
        </div>
      )}

      {!loadingF && !loadingB && favoriteBusinesses.length === 0 && (
        <div className="text-center py-12">
          <Heart size={64} className="mx-auto mb-4 text-zinc-500" />
          <p className="text-zinc-400 text-lg mb-2">Nenhum favorito ainda</p>
          <p className="text-sm text-zinc-500">
            Navegue pela página inicial e clique no ícone de coração para adicionar favoritos.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favoriteBusinesses.map((item) => {
          const { favorite, business } = item;
          return (
            <div
              key={favorite.id}
              onClick={() => handleOpenModal(business)}
              className="p-4 bg-[#2f2f33] rounded-lg border border-zinc-700 flex items-start justify-between hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  {business.image_url && (
                    <img
                      src={business.image_url}
                      alt={business.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="text-white font-semibold mb-1">{business.name}</div>
                    <div className="text-sm text-zinc-400 mb-2">
                      {business.description || 'Sem descrição'}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Favoritado em {new Date(favorite.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <button
                  onClick={(e) => handleRemoveFavorite(favorite.id, e)}
                  disabled={removingId === favorite.id}
                  className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {removingId === favorite.id ? 'Removendo...' : 'Remover'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
