import { useState, useEffect } from 'react';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AutoCarousel, ManualCarousel } from '@/components/AutoCarousel';
import { MapPin, Phone, MessageCircle, Instagram, Search } from 'lucide-react';
import { Advertisement } from '@/types/advertisement';
import Autoplay from "embla-carousel-autoplay";

const Leadpage = () => {
  const {
    advertisements,
    loading,
    filters,
    setFilters,
    categories,
    currentPage,
    totalPages,
    totalCount,
    handlePageChange,
    loadFeaturedAdvertisements
  } = useAdvertisements();

  const [featuredAds, setFeaturedAds] = useState<Advertisement[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load featured advertisements on component mount
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const featured = await loadFeaturedAdvertisements();
        setFeaturedAds(featured);
      } catch (error) {
        console.error('Error loading featured ads:', error);
      }
    };
    
    loadFeatured();
  }, []);

  // Get categories that have advertisements
  const categoriesWithAds = categories.filter(category => 
    advertisements.some(ad => ad.category === category)
  );

  // Handle category selection from menu - scroll to section instead of filtering
  const handleCategoryClick = (category: string) => {
    const element = document.getElementById(`category-${category.toLowerCase().replace(/\s+/g, '-')}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to search section
  const handleSearchClick = () => {
    const element = document.getElementById('buscar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilters({ ...filters, search: value || undefined });
  };

  const handleCategoryFilter = (category: string) => {
    if (category === 'all') {
      setFilters({ ...filters, category: undefined });
    } else {
      setFilters({ ...filters, category });
    }
  };

  const handleLocationFilter = (location: string) => {
    if (location === 'all') {
      setFilters({ ...filters, location: undefined });
    } else {
      setFilters({ ...filters, location });
    }
  };

  const clearFilters = () => {
    setSearchValue('');
    setFilters({});
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(`Olá! Vi seu anúncio "${name}" e gostaria de mais informações.`);
    const whatsappUrl = `https://wa.me/55${phone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      {/* Header fixo como no site de referência */}
      <header className={`bg-orange-500 text-white py-4 shadow-lg transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 z-50' : ''}`}>
        <div className="container mx-auto px-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Estância Turística de Paraibuna</h1>
            </div>
            
            {/* Menu navegação igual ao site original */}
            <div className="flex space-x-6">
              <button 
                onClick={() => {
                  const element = document.getElementById('destaques');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-orange-200 transition-colors"
              >
                Destaques
              </button>
              <button 
                onClick={handleSearchClick}
                className="hover:text-orange-200 transition-colors"
              >
                Pesquisar
              </button>
              {categoriesWithAds.map((category) => (
                <button 
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="hover:text-orange-200 transition-colors"
                >
                  {category}
                </button>
              ))}
              <button 
                onClick={() => {
                  const element = document.getElementById('pontos-turisticos');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-orange-200 transition-colors"
              >
                Pontos Turísticos
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('anuncie-aqui');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-orange-200 transition-colors"
              >
                Anuncie Aqui
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Seção de Destaques - Replicando layout do site original */}
      <section id="destaques" className={`bg-gradient-to-r from-orange-400 to-orange-600 text-white ${isScrolled ? 'pt-20' : 'pt-16'}`}>
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">Destaques de Paraibuna</h2>
            <p className="text-xl text-orange-100">Descubra os melhores estabelecimentos e atrações</p>
          </div>

          {/* Grid de destaques igual ao site original */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-white">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Carregando destaques...</p>
              </div>
            </div>
          ) : featuredAds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {featuredAds.slice(0, 4).map((ad) => (
                <Card key={ad.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white border-white/20">
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <AutoCarousel 
                      images={ad.photos || []}
                      alt={ad.name}
                      className="transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-bold text-lg mb-2 text-blue-700">{ad.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ad.description}</p>
                    <Button 
                      onClick={() => handleWhatsApp(ad.whatsapp || ad.phone, ad.name)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      Mais Informações
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/80">Nenhum anúncio em destaque no momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Seção de Busca - Igual ao "Encontre o que procura" do site original */}
      <section id="buscar" className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Encontre o que procura!</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="flex gap-4 flex-wrap justify-center">
                <Select onValueChange={handleLocationFilter}>
                  <SelectTrigger className="bg-white text-gray-900 w-48">
                    <SelectValue placeholder="Filtrar por Bairro:" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Bairros</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={handleCategoryFilter}>
                  <SelectTrigger className="bg-white text-gray-900 w-48">
                    <SelectValue placeholder="Filtrar por Serviço:" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Serviços</SelectItem>
                    {categoriesWithAds.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={clearFilters}
                  className="bg-green-500 hover:bg-green-600 text-white px-6"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seções por categoria - igual ao "Comércios e Serviços" do site original */}
      {categoriesWithAds.map((category) => {
        const categoryAds = advertisements.filter(ad => ad.category === category);
        if (categoryAds.length === 0) return null;
        
        return (
          <section 
            key={category} 
            id={`category-${category.toLowerCase().replace(/\s+/g, '-')}`} 
            className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-16"
          >
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">{category}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryAds.slice(0, 4).map((ad) => (
                  <Card key={ad.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm">
                    <div className="aspect-video bg-gray-200 overflow-hidden">
                      <AutoCarousel 
                        images={ad.photos || []}
                        alt={ad.name}
                      />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-bold text-lg mb-2 text-blue-700">{ad.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ad.description}</p>
                      <Button 
                        onClick={() => handleWhatsApp(ad.whatsapp || ad.phone, ad.name)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        Mais Informações
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Seção Pontos Turísticos */}
      <section id="pontos-turisticos" className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Pontos Turísticos</h2>
            <p className="text-xl text-blue-100">Explore as belezas naturais de Paraibuna</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAds.slice(0, 4).map((ad) => (
              <Card key={`tourist-${ad.id}`} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <AutoCarousel 
                    images={ad.photos || []}
                    alt={ad.name}
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-bold text-lg mb-2 text-blue-700">{ad.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ad.description}</p>
                  <Button 
                    onClick={() => handleWhatsApp(ad.whatsapp || ad.phone, ad.name)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    Mais Informações
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Anuncie Aqui */}
      <section id="anuncie-aqui" className="bg-gradient-to-r from-green-400 to-green-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Anuncie Aqui</h2>
            <p className="text-xl text-green-100 mb-8">
              Divulgue seu negócio na Estância Turística de Paraibuna
            </p>
            <Button 
              onClick={() => window.open('https://wa.me/5512912345678?text=Olá! Gostaria de anunciar meu negócio no site da Estância Turística de Paraibuna.', '_blank')}
              className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-3"
            >
              Entre em Contato
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leadpage;