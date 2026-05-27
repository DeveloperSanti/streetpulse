import { Link } from 'react-router-dom';
import { Flag, Trophy, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <>
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Retá. Compite. Subí de rango.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          La plataforma de carreras callejeras donde los pilotos se enfrentan a
          su nivel, gestionan sus vehículos y escalan en el ranking global.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/register">Crear cuenta</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Ya tengo cuenta</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Flag className="h-6 w-6" />}
          title="Retos por rango"
          description="Solo te enfrentás a pilotos de tu mismo rango y tipo de vehículo. Carreras justas, decisiones rápidas."
        />
        <FeatureCard
          icon={<Trophy className="h-6 w-6" />}
          title="Ranking dinámico"
          description="Tres victorias consecutivas y ascendés. El leaderboard se actualiza al instante."
        />
        <FeatureCard
          icon={<Bell className="h-6 w-6" />}
          title="Notificaciones en vivo"
          description="Cuando alguien te reta, acepta o registra un resultado, te enterás en tiempo real vía WebSocket."
        />
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-3">
      <div className="text-primary">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
