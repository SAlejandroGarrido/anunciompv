export interface Advertisement {
  id: string;
  name: string;
  description: string;
  photos: string[];
  phone: string;
  whatsapp?: string;
  instagram?: string;
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
    googleMapsUrl?: string;
  };
  status: 'active' | 'paused' | 'inactive';
  category: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdvertisementFilters {
  search?: string;
  category?: string;
  status?: 'active' | 'paused' | 'inactive';
  location?: string;
  featuredOnly?: boolean;
}

export interface AdvertisementFormData {
  name: string;
  description: string;
  photos: File[];
  phone: string;
  whatsapp?: string;
  instagram?: string;
  address: string;
  category: string;
  featured: boolean;
}