import { useState, useEffect } from 'react';
import { Advertisement, AdvertisementFilters } from '@/types/advertisement';

// Mock data para demonstração - em produção será substituído por API/Supabase
const mockAdvertisements: Advertisement[] = [
  {
    id: '1',
    name: 'Pousada Serra Verde',
    description: 'Uma pousada aconchegante no coração da serra, ideal para relaxar e contemplar a natureza. Oferecemos quartos confortáveis com vista para as montanhas.',
    photos: ['/placeholder.svg'],
    phone: '(12) 3456-7890',
    whatsapp: '5512345678900',
    instagram: '@pousadaserraverde',
    location: {
      address: 'Estrada da Serra, 123 - Paraibuna, SP',
      latitude: -23.3847,
      longitude: -45.6625,
      googleMapsUrl: 'https://maps.google.com/?q=-23.3847,-45.6625'
    },
    status: 'active',
    category: 'Hospedagem',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Restaurante Sabor da Roça',
    description: 'Culinária típica da região com ingredientes frescos e locais. Especialidade em comida caipira e pratos da fazenda.',
    photos: ['/placeholder.svg'],
    phone: '(12) 9876-5432',
    whatsapp: '5512987654321',
    instagram: '@sabordarca',
    location: {
      address: 'Rua Principal, 456 - Centro, Paraibuna, SP',
      latitude: -23.3847,
      longitude: -45.6625
    },
    status: 'active',
    category: 'Gastronomia',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Cachoeira do Sol',
    description: 'Uma das mais belas cachoeiras da região, ideal para banho e contemplação. Trilha de dificuldade moderada.',
    photos: ['/placeholder.svg'],
    phone: '(12) 1111-2222',
    location: {
      address: 'Trilha da Cachoeira, s/n - Zona Rural, Paraibuna, SP',
      latitude: -23.3847,
      longitude: -45.6625
    },
    status: 'paused',
    category: 'Atração Natural',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-25')
  }
];

export const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(mockAdvertisements);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AdvertisementFilters>({});

  const filteredAdvertisements = advertisements.filter(ad => {
    if (filters.search && !ad.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !ad.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && ad.category !== filters.category) {
      return false;
    }
    if (filters.status && ad.status !== filters.status) {
      return false;
    }
    if (filters.location && !ad.location.address.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    return true;
  });

  const createAdvertisement = async (data: Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const newAd: Advertisement = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setAdvertisements(prev => [newAd, ...prev]);
      return newAd;
    } finally {
      setLoading(false);
    }
  };

  const updateAdvertisement = async (id: string, data: Partial<Advertisement>) => {
    setLoading(true);
    try {
      setAdvertisements(prev => 
        prev.map(ad => 
          ad.id === id 
            ? { ...ad, ...data, updatedAt: new Date() }
            : ad
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteAdvertisement = async (id: string) => {
    setLoading(true);
    try {
      setAdvertisements(prev => prev.filter(ad => ad.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string) => {
    const ad = advertisements.find(a => a.id === id);
    if (ad) {
      const newStatus = ad.status === 'active' ? 'paused' : 'active';
      await updateAdvertisement(id, { status: newStatus });
    }
  };

  return {
    advertisements: filteredAdvertisements,
    loading,
    filters,
    setFilters,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    toggleStatus,
    categories: ['Hospedagem', 'Gastronomia', 'Atração Natural', 'Turismo Rural', 'Aventura', 'Cultura']
  };
};