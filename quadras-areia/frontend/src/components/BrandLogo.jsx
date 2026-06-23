import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function BrandLogo({
  size = 'md',
  showAddress = false,
  light = false,
  to = '/',
  link = true,
}) {
  const sizes = {
    sm: 'h-9',
    md: 'h-11',
    lg: 'h-16',
    xl: 'h-24 sm:h-28',
  };

  const content = (
    <>
      <img
        src="/logo-quintal127.png"
        alt="Quintal 127 - Arena & Choperia"
        className={`${sizes[size]} w-auto object-contain`}
      />
      {showAddress && (
        <div className="hidden border-l border-primary-200 pl-3 sm:block">
          <p className={`flex items-center gap-1.5 text-xs font-medium ${light ? 'text-white/80' : 'text-muted'}`}>
            <MapPin size={13} className={light ? 'text-lime-300' : 'text-lime-600'} />
            Rua Laureano 127, Campeche
          </p>
        </div>
      )}
    </>
  );

  if (!link) {
    return <div className="flex items-center gap-3">{content}</div>;
  }

  return (
    <Link to={to} className="flex items-center gap-3">
      {content}
    </Link>
  );
}
