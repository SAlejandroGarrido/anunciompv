import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onNewAdvertisement: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
}

const Header = ({ onNewAdvertisement, searchValue, onSearchChange, onFilterClick }: HeaderProps) => {
  return (
    <header className="bg-gradient-card border-b border-border shadow-soft">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Gerenciamento de Anúncios
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie anúncios turísticos de Paraibuna e região
            </p>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar anúncios..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="default"
                onClick={onFilterClick}
                className="shrink-0"
              >
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              
              <Button
                variant="gradient"
                size="default"
                onClick={onNewAdvertisement}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
                Novo Anúncio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;