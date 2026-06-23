import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-primary-800/20 bg-dark text-white">
      <div className="page-container py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <BrandLogo size="lg" light link={false} />
          <p className="text-center text-sm text-white/60 sm:text-right">
            © {new Date().getFullYear()} Quintal 127 — Arena & Choperia
          </p>
        </div>
      </div>
    </footer>
  );
}
