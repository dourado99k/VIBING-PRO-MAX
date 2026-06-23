import { Link } from 'react-router-dom';
import { Calendar, CreditCard, Beer, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Card from '../components/Card';
import BrandLogo from '../components/BrandLogo';

export default function Home() {
  const features = [
    {
      icon: MapPin,
      title: 'Quadras de Areia',
      desc: 'Espaços no Campeche para beach tennis, vôlei e futevôlei.',
    },
    {
      icon: Calendar,
      title: 'Reserva Online',
      desc: 'Consulte horários e reserve em poucos cliques, de onde estiver.',
    },
    {
      icon: CreditCard,
      title: 'Pagamento Fácil',
      desc: 'Pague via PIX, cartão ou dinheiro com confirmação imediata.',
    },
    {
      icon: Beer,
      title: 'Arena & Choperia',
      desc: 'Depois do jogo, aproveite o ambiente da Quintal 127.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <section className="relative overflow-hidden bg-hero-gradient px-4 py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-lime-glow" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-8 flex justify-center">
            <BrandLogo size="xl" link={false} />
          </div>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Sua quadra de areia no{' '}
            <span className="brand-gradient-text">Campeche</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Reserve online, escolha o horário e venha jogar!
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/cadastro">
              <Button size="lg" variant="primary">
                Criar conta
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outlineLight">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="page-container py-16">
        <h2 className="mb-2 text-center text-2xl font-bold text-primary-900">Como funciona</h2>
        <p className="mb-10 text-center text-muted">Reserve em 3 passos simples</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-primary-100 text-center transition-all hover:border-lime-300 hover:shadow-glow">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-glow-blue">
                <Icon className="text-lime-300" size={28} />
              </div>
              <h3 className="font-bold text-primary-900">{title}</h3>
              <p className="mt-2 text-sm text-muted">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
