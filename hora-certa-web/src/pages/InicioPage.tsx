import React, { useState } from 'react';
import Header from './../components/Header/Header';
import Navigation from './../components/NavBar/Navigation';

interface Barbearia {
  id: number;
  nome: string;
  endereco: string;
  horario: string;
  imagem: string;
}

const InicioPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage1, setCurrentPage1] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(0);

  // Dados mock das barbearias - Carrossel 1
  const barbearias1: Barbearia[] = [
    {
      id: 1,
      nome: 'Barbearia Vintage',
      endereco: '2ª avenida, 3081 - Rua 01',
      horario: '08:00 as 18:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 2,
      nome: 'Barbearia Vintage',
      endereco: 'Matos Brandemarte, Brasília',
      horario: '08:00 as 18:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 3,
      nome: 'Barbearia Vintage',
      endereco: 'Niveos Branvomne, Brasília',
      horario: '08:00 as 18:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 4,
      nome: 'Barbearia Vintage',
      endereco: 'Natos Brandemarte, Brasília',
      horario: '08:00 as 18:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 5,
      nome: 'Barbearia Vintage',
      endereco: '4ª avenida, 4081 - Rua 01',
      horario: '08:00 as 18:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 6,
      nome: 'Barbearia Vintage',
      endereco: 'Matos Brandemarte, Brasília',
      horario: '08:00 as 18:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 7,
      nome: 'Barbearia Vintage',
      endereco: 'Niveos Branvomne, Brasília',
      horario: '08:00 as 18:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 8,
      nome: 'Barbearia Vintage',
      endereco: 'Natos Brandemarte, Brasília',
      horario: '08:00 as 18:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    }
  ];

  // Dados mock das barbearias - Carrossel 2
  const barbearias2: Barbearia[] = [
    {
      id: 9,
      nome: 'Barbearia Classic',
      endereco: 'Centro, Brasília',
      horario: '09:00 as 19:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 10,
      nome: 'Barbearia Modern',
      endereco: 'Asa Sul, Brasília',
      horario: '08:00 as 20:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 11,
      nome: 'Barbearia Premium',
      endereco: 'Lago Sul, Brasília',
      horario: '10:00 as 18:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 12,
      nome: 'Barbearia Express',
      endereco: 'Asa Norte, Brasília',
      horario: '08:00 as 18:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 13,
      nome: 'Barbearia Elite',
      endereco: 'Lago Norte, Brasília',
      horario: '09:00 as 19:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 14,
      nome: 'Barbearia Style',
      endereco: 'Asa Norte, Brasília',
      horario: '08:00 as 18:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 15,
      nome: 'Barbearia Trending',
      endereco: 'Centro, Brasília',
      horario: '10:00 as 20:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    },
    {
      id: 16,
      nome: 'Barbearia Luxo',
      endereco: 'Lago Sul, Brasília',
      horario: '09:00 as 19:00',
      imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop'
    }
  ];

  // Filtrar barbearias pela busca
  const barbeariasFiltradas1 = barbearias1.filter(barbearia =>
    barbearia.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const barbeariasFiltradas2 = barbearias2.filter(barbearia =>
    barbearia.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Carrossel 1 - 4 itens por página (1 linha de 4)
  const itemsPerPage = 4;
  const totalPages1 = Math.ceil(barbeariasFiltradas1.length / itemsPerPage);
  const totalPages2 = Math.ceil(barbeariasFiltradas2.length / itemsPerPage);
  
  const startIndex1 = currentPage1 * itemsPerPage;
  const barbeariasPagina1 = barbeariasFiltradas1.slice(startIndex1, startIndex1 + itemsPerPage);

  const startIndex2 = currentPage2 * itemsPerPage;
  const barbeariasPagina2 = barbeariasFiltradas2.slice(startIndex2, startIndex2 + itemsPerPage);

  const handlePrevious1 = () => {
    setCurrentPage1(prev => (prev > 0 ? prev - 1 : totalPages1 - 1));
  };

  const handleNext1 = () => {
    setCurrentPage1(prev => (prev < totalPages1 - 1 ? prev + 1 : 0));
  };

  const handlePrevious2 = () => {
    setCurrentPage2(prev => (prev > 0 ? prev - 1 : totalPages2 - 1));
  };

  const handleNext2 = () => {
    setCurrentPage2(prev => (prev < totalPages2 - 1 ? prev + 1 : 0));
  };

  return (
    <div className="min-h-screen w-screen bg-[#1a1a1a] text-white pb-10 m-0">
      <Header />
      <Navigation />

      {/* Search Bar */}
      <div className="max-w-[600px] mx-auto mt-10 px-16 flex gap-3">
        <input
          type="text"
          className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-5 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
          placeholder="Buscar Barbearia"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage1(0);
            setCurrentPage2(0);
          }}
        />
        <button className="bg-indigo-500 rounded-lg w-12 h-12 flex items-center justify-center hover:bg-indigo-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      {/* Primeiro Carrossel */}
      <div className="max-w-[1400px] mx-auto px-16 mt-12">
        <div className="relative">
          <div className="grid grid-cols-4 gap-6">
            {barbeariasPagina1.map((barbearia) => (
              <div 
                key={barbearia.id} 
                className="bg-[#2a2a2a] rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.2)] transition-all"
              >
                <div className="w-full h-40 overflow-hidden relative">
                  <img 
                    src={barbearia.imagem} 
                    alt={barbearia.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-white mb-2">{barbearia.nome}</h3>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                    <span>📍</span>
                    {barbearia.endereco}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">{barbearia.horario}</p>
                  <button className="w-full bg-indigo-500 rounded-lg py-3 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors">
                    Reservar horário
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Setas de navegação do primeiro carrossel */}
          <button 
            className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/20 hover:border-indigo-500 transition-all"
            onClick={handleNext1}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2"/>
            </svg>
          </button>
        </div>

      
      </div>

      {/* Segundo Carrossel */}
      <div className="max-w-[1400px] mx-auto px-16 mt-12">
        <div className="relative">
          <div className="grid grid-cols-4 gap-6">
            {barbeariasPagina2.map((barbearia) => (
              <div 
                key={barbearia.id} 
                className="bg-[#2a2a2a] rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.2)] transition-all"
              >
                <div className="w-full h-40 overflow-hidden relative">
                  <img 
                    src={barbearia.imagem} 
                    alt={barbearia.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-white mb-2">{barbearia.nome}</h3>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                    <span>📍</span>
                    {barbearia.endereco}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">{barbearia.horario}</p>
                  <button className="w-full bg-indigo-500 rounded-lg py-3 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors">
                    Reservar horário
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Setas de navegação do segundo carrossel */}
          <button 
            className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/20 hover:border-indigo-500 transition-all"
            onClick={handleNext2}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        {/* Pagination Dots - Carrossel 2 */}
  
      </div>
    </div>
  );
};

export default InicioPage;