import { LogOut } from 'lucide-react';
import { Navbar } from './Navbar';
import { Button } from '../ui/Button';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export function AdminLayout({ children }) {
  const { logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </Navbar>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
