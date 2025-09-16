import { Edit, Trash2, Pause, Play, Phone, MessageCircle, Instagram, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Advertisement } from '@/types/advertisement';

interface AdvertisementCardProps {
  advertisement: Advertisement;
  onEdit: (ad: Advertisement) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const AdvertisementCard = ({ advertisement, onEdit, onDelete, onToggleStatus }: AdvertisementCardProps) => {
  const getStatusColor = (status: Advertisement['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'paused':
        return 'bg-warning text-warning-foreground';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: Advertisement['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'paused':
        return 'Pausado';
      case 'inactive':
        return 'Inativo';
      default:
        return 'Inativo';
    }
  };

  const sanitizePhone = (value: string) => value.replace(/\D/g, '');
  const ensureHttps = (url: string) => (url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`);

  const handleWhatsApp = () => {
    const raw = advertisement.whatsapp || advertisement.phone;
    if (!raw) return;
    const number = sanitizePhone(raw);
    if (number) window.open(`https://wa.me/${number}`, '_blank', 'noopener,noreferrer');
  };

  const handleInstagram = () => {
    const ig = advertisement.instagram?.trim();
    if (!ig) return;
    let url = ig;
    if (!(ig.startsWith('http://') || ig.startsWith('https://'))) {
      const username = ig.replace(/^@/, '').replace(/^instagram\.com\//i, '');
      url = `https://instagram.com/${username}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLocation = () => {
    const { googleMapsUrl, latitude, longitude, address } = advertisement.location;
    if (googleMapsUrl) {
      window.open(ensureHttps(googleMapsUrl), '_blank', 'noopener,noreferrer');
    } else if (latitude && longitude) {
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank', 'noopener,noreferrer');
    } else if (address) {
      const q = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="group hover:shadow-medium transition-all duration-300 bg-gradient-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {advertisement.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {advertisement.category}
              </Badge>
              <Badge className={`text-xs ${getStatusColor(advertisement.status)}`}>
                {getStatusText(advertisement.status)}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(advertisement)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleStatus(advertisement.id)}
              className="h-8 w-8"
            >
              {advertisement.status === 'active' ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(advertisement.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {advertisement.photos && advertisement.photos.length > 0 && (
          <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
            <img
              src={advertisement.photos[0]}
              alt={advertisement.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}

        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
          {advertisement.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{advertisement.location.address}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/50">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`tel:${sanitizePhone(advertisement.phone)}`, '_self')}
              className="flex-1"
            >
              <Phone className="h-3 w-3 mr-1" />
              {advertisement.phone}
            </Button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {advertisement.whatsapp && (
              <Button
                variant="success"
                size="sm"
                onClick={handleWhatsApp}
                className="flex-1 min-w-[100px]"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                WhatsApp
              </Button>
            )}
            
            {advertisement.instagram && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleInstagram}
                className="flex-1 min-w-[100px]"
              >
                <Instagram className="h-3 w-3 mr-1" />
                Instagram
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleLocation}
              className="flex-1 min-w-[100px]"
            >
              <MapPin className="h-3 w-3 mr-1" />
              Mapa
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdvertisementCard;