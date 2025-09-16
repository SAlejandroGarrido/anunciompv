import { useState, useEffect } from 'react';
import { Advertisement, AdvertisementFilters, AdvertisementFormData } from '@/types/advertisement';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdvertisementFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  
  const ITEMS_PER_PAGE = 6;

  // Load advertisements from Supabase
  const loadAdvertisements = async (page = 1) => {
    try {
      setLoading(true);
      
      // Get total count first
      const { count } = await supabase
        .from('advertisements')
        .select('*', { count: 'exact', head: true });
      
      setTotalCount(count || 0);
      
      // Get paginated data
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Transform database data to match our interface
      const transformedData: Advertisement[] = data?.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        photos: item.photos || [],
        phone: item.phone,
        whatsapp: item.whatsapp,
        instagram: item.instagram,
        location: item.location || { address: '' },
        status: item.status as 'active' | 'paused' | 'inactive',
        category: item.category,
        featured: item.featured || false,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      })) || [];

      setAdvertisements(transformedData);
    } catch (error) {
      console.error('Error loading advertisements:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os anúncios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load featured advertisements
  const loadFeaturedAdvertisements = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('featured', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        photos: item.photos || [],
        phone: item.phone,
        whatsapp: item.whatsapp,
        instagram: item.instagram,
        location: item.location || { address: '' },
        status: item.status as 'active' | 'paused' | 'inactive',
        category: item.category,
        featured: item.featured || false,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      })) || [];
    } catch (error) {
      console.error('Error loading featured advertisements:', error);
      return [];
    }
  };

  useEffect(() => {
    loadAdvertisements(currentPage);
  }, [currentPage]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter advertisements (filtering happens in memory for simplicity)
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
    if (filters.featuredOnly && !ad.featured) {
      return false;
    }
    return true;
  });
  
  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }, [filters]);

  const createAdvertisement = async (formData: AdvertisementFormData) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const insertData = {
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        photos: formData.photos || [],
        phone: formData.phone,
        whatsapp: formData.whatsapp || null,
        instagram: formData.instagram || null,
        location: { address: formData.address },
        category: formData.category,
        status: 'active',
        featured: formData.featured || false
      };

      const { data, error } = await supabase
        .from('advertisements')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      // Transform response and add to local state
      const newAd: Advertisement = {
        id: data.id,
        name: data.name,
        description: data.description,
        photos: data.photos || [],
        phone: data.phone,
        whatsapp: data.whatsapp,
        instagram: data.instagram,
        location: data.location || { address: '' },
        status: data.status as 'active' | 'paused' | 'inactive',
        category: data.category,
        featured: data.featured || false,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      // Reload advertisements to maintain pagination
      await loadAdvertisements(1);
      setCurrentPage(1);
      return newAd;
    } catch (error) {
      console.error('Error creating advertisement:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o anúncio",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAdvertisement = async (id: string, data: Partial<Advertisement>) => {
    try {
      setLoading(true);
      
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.description) updateData.description = data.description;
      if (data.phone) updateData.phone = data.phone;
      if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp || null;
      if (data.instagram !== undefined) updateData.instagram = data.instagram || null;
      if (data.location) updateData.location = data.location;
      if (data.category) updateData.category = data.category;
      if (data.status) updateData.status = data.status;
      if (data.photos) updateData.photos = data.photos;
      if (data.featured !== undefined) updateData.featured = data.featured;

      const { error } = await supabase
        .from('advertisements')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setAdvertisements(prev => 
        prev.map(ad => 
          ad.id === id 
            ? { ...ad, ...data, updatedAt: new Date() }
            : ad
        )
      );
    } catch (error) {
      console.error('Error updating advertisement:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o anúncio",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAdvertisement = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Reload current page after deletion
      await loadAdvertisements(currentPage);
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar o anúncio",
        variant: "destructive"
      });
      throw error;
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

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return {
    advertisements: filteredAdvertisements,
    loading,
    filters,
    setFilters,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    toggleStatus,
    loadFeaturedAdvertisements,
    categories: ['Hospedagem', 'Gastronomia', 'Atração Natural', 'Turismo Rural', 'Aventura', 'Cultura'],
    currentPage,
    totalPages,
    totalCount,
    handlePageChange
  };
};