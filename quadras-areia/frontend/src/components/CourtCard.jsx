import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import Card from './Card';
import Button from './Button';

export default function CourtCard({ court }) {
  return (
    <Card className="flex flex-col transition-all hover:border-lime-300 hover:shadow-glow">
      <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 shadow-glow-blue">
        <MapPin className="text-lime-300" size={40} />
      </div>
      <h3 className="text-lg font-bold text-primary-900">{court.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted line-clamp-2">
        {court.description || 'Quadra de areia no Quintal 127, Campeche.'}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm font-bold text-lime-600">
          <Clock size={16} />
          R$ {court.pricePerHour.toFixed(2)}/h
        </span>
        <Link to={`/quadras/${court.id}`}>
          <Button size="sm">Ver detalhes</Button>
        </Link>
      </div>
    </Card>
  );
}
