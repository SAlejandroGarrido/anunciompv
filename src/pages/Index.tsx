import { useState } from 'react';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import AdvertisementCard from '@/components/AdvertisementCard';
import FilterDialog from '@/components/FilterDialog';
import AdvertisementForm from '@/components/AdvertisementForm';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import AuthModal from '@/components/AuthModal';
import { Advertisement, AdvertisementFormData } from '@/types/advertisement';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Index = () => {
  const { toast } = useToast();
  const {
    advertisements,
    loading,
    filters,
    setFilters,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    toggleStatus,
    categories,
    currentPage,
    totalPages,
    totalCount,
    handlePageChange
  } = useAdvertisements();

  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editingAdvertisement, setEditingAdvertisement] = useState<Advertisement | null>(null);
  const [deletingAdvertisement, setDeletingAdvertisement] = useState<Advertisement | null>(null);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilters({ ...filters, search: value || undefined });
  };

  const handleNewAdvertisement = () => {
    setEditingAdvertisement(null);
    setShowForm(true);
  };

  const handleEditAdvertisement = (advertisement: Advertisement) => {
    setEditingAdvertisement(advertisement);
    setShowForm(true);
  };

  const handleDeleteAdvertisement = (advertisement: Advertisement) => {
    setDeletingAdvertisement(advertisement);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deletingAdvertisement) {
      try {
        await deleteAdvertisement(deletingAdvertisement.id);
        toast({
          title: "Anúncio excluído",
          description: "O anúncio foi excluído com sucesso!",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o anúncio.",
          variant: "destructive",
        });
      }
      setShowDeleteConfirm(false);
      setDeletingAdvertisement(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id);
      const ad = advertisements.find(a => a.id === id);
      const newStatus = ad?.status === 'active' ? 'pausado' : 'ativado';
      toast({
        title: "Status atualizado",
        description: `Anúncio ${newStatus} com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao alterar o status do anúncio.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (data: AdvertisementFormData) => {
    if (editingAdvertisement) {
      await updateAdvertisement(editingAdvertisement.id, {
        name: data.name,
        description: data.description,
        phone: data.phone,
        whatsapp: data.whatsapp,
        instagram: data.instagram,
        location: {
          ...editingAdvertisement.location,
          address: data.address,
        },
        category: data.category,
        photos: data.photos as unknown as string[], // URLs das fotos (já processadas no form)
      });
    } else {
      await createAdvertisement(data);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onNewAdvertisement={handleNewAdvertisement}
        searchValue={searchValue}
        onSearchChange={handleSearch}
        onFilterClick={() => setShowFilters(true)}
        onAuthRequired={() => setShowAuthModal(true)}
      />

      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando anúncios...</p>
            </div>
          </div>
        ) : advertisements.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">Nenhum anúncio encontrado</h3>
              <p className="text-muted-foreground mb-6">
                {filters.search || filters.category || filters.status || filters.location
                  ? 'Tente ajustar os filtros de busca ou criar um novo anúncio.'
                  : 'Comece criando seu primeiro anúncio turístico!'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advertisements.map((advertisement) => (
                <AdvertisementCard
                  key={advertisement.id}
                  advertisement={advertisement}
                  onEdit={handleEditAdvertisement}
                  onDelete={() => handleDeleteAdvertisement(advertisement)}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
            
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
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            handlePageChange(currentPage + 1);
                          }
                        }}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </main>

      <FilterDialog
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        open={showFilters}
        onOpenChange={setShowFilters}
      />

      <AdvertisementForm
        advertisement={editingAdvertisement || undefined}
        categories={categories}
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={confirmDelete}
        advertisementName={deletingAdvertisement?.name || ''}
      />

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onAuthenticated={() => {
          // Reload advertisements after authentication
          window.location.reload();
        }}
      />
    </div>
  );
};

export default Index;
