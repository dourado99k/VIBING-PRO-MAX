import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import Card from './Card';
import Button from './Button';

export default function CourtCard({ court }) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-card-hover">
      <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-sand-200">
        <MapPin className="text-primary-600" size={40} />
      </div>
      <h3 className="text-lg font-bold text-dark">{court.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted line-clamp-2">
        {court.description || 'Quadra de areia para esportes e lazer.'}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm font-semibold text-primary-600">
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
