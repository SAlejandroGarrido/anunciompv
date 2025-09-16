import { Plus, Search, Filter, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onNewAdvertisement: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  onAuthRequired: () => void;
}

const Header = ({ onNewAdvertisement, searchValue, onSearchChange, onFilterClick, onAuthRequired }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNewAdvertisement = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    onNewAdvertisement();
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso"
      });
    }
  };

  return (
    <header className="bg-gradient-card border-b border-border shadow-soft">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Gerenciamento de Anúncios
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie anúncios turísticos de Paraibuna e região
              </p>
            </div>
            
            <a 
              href="/leadpage" 
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
            >
              Ver Leadpage
            </a>
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
            
            <div className="flex gap-2 items-center">
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
                onClick={handleNewAdvertisement}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
                Novo Anúncio
              </Button>

              {user && (
                <div className="flex gap-2 items-center ml-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {!user && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={onAuthRequired}
                  className="shrink-0"
                >
                  <User className="h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;