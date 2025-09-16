import { useState, useEffect } from 'react';
import { X, Upload, MapPin, Phone, MessageCircle, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Advertisement, AdvertisementFormData } from '@/types/advertisement';

interface AdvertisementFormProps {
  advertisement?: Advertisement;
  categories: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AdvertisementFormData) => Promise<void>;
}

const AdvertisementForm = ({ 
  advertisement, 
  categories, 
  open, 
  onOpenChange, 
  onSubmit 
}: AdvertisementFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AdvertisementFormData>({
    name: '',
    description: '',
    photos: [],
    phone: '',
    whatsapp: '',
    instagram: '',
    address: '',
    category: '',
  });

  // Atualiza os dados do formulário quando o advertisement muda
  useEffect(() => {
    if (advertisement) {
      setFormData({
        name: advertisement.name || '',
        description: advertisement.description || '',
        photos: [],
        phone: advertisement.phone || '',
        whatsapp: advertisement.whatsapp || '',
        instagram: advertisement.instagram || '',
        address: advertisement.location.address || '',
        category: advertisement.category || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        photos: [],
        phone: '',
        whatsapp: '',
        instagram: '',
        address: '',
        category: '',
      });
    }
  }, [advertisement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.category) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
      setFormData({
        name: '',
        description: '',
        photos: [],
        phone: '',
        whatsapp: '',
        instagram: '',
        address: '',
        category: '',
      });
      toast({
        title: advertisement ? "Anúncio atualizado" : "Anúncio criado",
        description: advertisement 
          ? "O anúncio foi atualizado com sucesso!" 
          : "O anúncio foi criado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o anúncio. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AdvertisementFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {advertisement ? 'Editar Anúncio' : 'Novo Anúncio'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Anunciante / Ponto Turístico *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Pousada Serra Verde"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o estabelecimento, seus serviços e diferenciais..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photos">Fotos</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                Clique para adicionar fotos ou arraste aqui
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG até 5MB cada
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(12) 3456-7890"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="5512345678900"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="@seuinstagram"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço / Localização *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Rua, número, bairro, cidade, estado"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="gradient"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Salvando...' : (advertisement ? 'Atualizar' : 'Criar Anúncio')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdvertisementForm;