import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/" className="text-xl font-bold tracking-tight">
            StreetPulse
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Crear cuenta</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t">
        <div className="container mx-auto py-6 px-6 text-center text-sm text-muted-foreground">
          StreetPulse · Plataforma de carreras callejeras
        </div>
      </footer>
    </div>
  );
}
