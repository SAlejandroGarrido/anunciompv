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
    <div className={`min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 ${isScrolled ? 'pt-20' : ''}`}>
      {/* Header - fica fixo sempre durante o scroll */}
      <header className={`bg-orange-500 text-white py-4 shadow-lg transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 z-50' : ''}`}>
        <div className="container mx-auto px-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Estância Turística</h1>
            </div>
            
            {/* Menu principal com categorias */}
            <div className="flex space-x-6">
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
            </div>
          </nav>
        </div>
      </header>

      {/* Seção de Destaques - Separada e mais proeminente */}
      <section className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">🌟 Destaques da Região</h2>
            <p className="text-xl text-orange-100">Descubra os melhores estabelecimentos e atrações</p>
          </div>

          {/* Carrossel de Destaques */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-white">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Carregando destaques...</p>
              </div>
            </div>
          ) : featuredAds.length > 0 ? (
            <div className="relative">
              <Carousel 
                className="w-full"
                opts={{
                  align: "start",
                  loop: true,
                  skipSnaps: false,
                  dragFree: false,
                }}
                plugins={[
                  Autoplay({
                    delay: 3000,
                    stopOnInteraction: true,
                  }),
                ]}
              >
                <CarouselContent>
                  {featuredAds.map((ad, index) => (
                    <CarouselItem key={ad.id} className="md:basis-1/2 lg:basis-1/4">
                      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white/95 backdrop-blur-sm">
                        <div className="aspect-video bg-gray-200 overflow-hidden">
                          <AutoCarousel 
                            images={ad.photos || []}
                            alt={ad.name}
                            className="transition-transform group-hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-4">
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
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
              </Carousel>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/80">Nenhum anúncio em destaque no momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Seção de Busca */}
      <section id="buscar" className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-blue-700">🔍 Encontre o que Procura</h2>
              <p className="text-gray-600 text-lg">
                Use os filtros abaixo para encontrar exatamente o que você está buscando
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-lg mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nome ou descrição..."
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                
                <Select onValueChange={handleCategoryFilter}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 md:w-48 focus:border-orange-500">
                    <SelectValue placeholder="Filtrar por Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    {categoriesWithAds.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={handleLocationFilter}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 md:w-48 focus:border-orange-500">
                    <SelectValue placeholder="Filtrar por Localização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Localizações</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  onClick={clearFilters}
                  variant="outline" 
                  className="bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:border-orange-600"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>

            {/* Resultados da busca */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando anúncios...</p>
                </div>
              </div>
            ) : advertisements.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto bg-orange-50 rounded-lg p-8">
                  <h3 className="text-lg font-semibold mb-2 text-orange-700">Nenhum anúncio encontrado</h3>
                  <p className="text-orange-600 mb-6">
                    Tente ajustar os filtros de busca ou explore nossas categorias.
                  </p>
                  <Button 
                    onClick={clearFilters}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Ver Todos os Anúncios
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {advertisements.map((ad) => (
                    <Card key={ad.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white transform hover:scale-105 group">
                      <div className="aspect-video bg-gray-200 overflow-hidden relative">
                        <AutoCarousel 
                          images={ad.photos || []}
                          alt={ad.name}
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-bold text-lg mb-2 text-blue-700">{ad.name}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ad.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          {ad.location?.address && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{ad.location.address}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleWhatsApp(ad.whatsapp || ad.phone, ad.name)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm"
                            size="sm"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            WhatsApp
                          </Button>
                          
                          {ad.phone && (
                            <Button 
                              onClick={() => window.open(`tel:${ad.phone}`, '_self')}
                              variant="outline"
                              size="sm"
                              className="border-blue-500 text-blue-500 hover:bg-blue-50"
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {ad.instagram && (
                            <Button 
                              onClick={() => window.open(`https://instagram.com/${ad.instagram.replace('@', '')}`, '_blank')}
                              variant="outline"
                              size="sm"
                              className="border-pink-500 text-pink-500 hover:bg-pink-50"
                            >
                              <Instagram className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) {
                                handlePageChange(currentPage - 1);
                              }
                            }}
                            className={`text-orange-600 border-orange-600 hover:bg-orange-50 ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(page);
                                }}
                                isActive={currentPage === page}
                                className={currentPage === page 
                                  ? "bg-orange-500 text-white" 
                                  : "text-orange-600 border-orange-600 hover:bg-orange-50"
                                }
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) {
                                handlePageChange(currentPage + 1);
                              }
                            }}
                            className={`text-orange-600 border-orange-600 hover:bg-orange-50 ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Seções por Categoria */}
      {categoriesWithAds.map((category) => (
        <section 
          key={category} 
          id={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
          className="py-16 bg-gradient-to-br from-blue-50 to-white"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-blue-700">{category}</h2>
              <p className="text-gray-600 text-lg">
                Explore as melhores opções em {category.toLowerCase()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advertisements
                .filter(ad => ad.category === category)
                .slice(0, 6) // Mostrar apenas os primeiros 6 de cada categoria
                .map((ad) => (
                  <Card key={ad.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white transform hover:scale-105 group">
                    <div className="aspect-video bg-gray-200 overflow-hidden relative">
                      <AutoCarousel 
                        images={ad.photos || []}
                        alt={ad.name}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-lg mb-2 text-blue-700">{ad.name}</h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ad.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        {ad.location?.address && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{ad.location.address}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleWhatsApp(ad.whatsapp || ad.phone, ad.name)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm"
                          size="sm"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          WhatsApp
                        </Button>
                        
                        {ad.phone && (
                          <Button 
                            onClick={() => window.open(`tel:${ad.phone}`, '_self')}
                            variant="outline"
                            size="sm"
                            className="border-blue-500 text-blue-500 hover:bg-blue-50"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {ad.instagram && (
                          <Button 
                            onClick={() => window.open(`https://instagram.com/${ad.instagram.replace('@', '')}`, '_blank')}
                            variant="outline"
                            size="sm"
                            className="border-pink-500 text-pink-500 hover:bg-pink-50"
                          >
                            <Instagram className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Botão para ver todos da categoria */}
            <div className="text-center mt-8">
              <Button 
                onClick={() => {
                  setFilters({ category });
                  handleSearchClick();
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
              >
                Ver Todos em {category}
              </Button>
            </div>
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="bg-orange-500 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Estância Turística</h3>
          <p className="text-orange-100">
            Descubra os melhores estabelecimentos e serviços da nossa região.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Leadpage;