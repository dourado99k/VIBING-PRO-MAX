import { Link } from 'react-router-dom';
import { Calendar, Shield, CreditCard, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Home() {
  const features = [
    { icon: MapPin, title: 'Quadras de Areia', desc: 'Espaços premium para beach tennis, vôlei e futevôlei.' },
    { icon: Calendar, title: 'Reserva Online', desc: 'Consulte horários e reserve em poucos cliques.' },
    { icon: CreditCard, title: 'Pagamento Fácil', desc: 'Pague via PIX, cartão ou dinheiro com confirmação imediata.' },
    { icon: Shield, title: 'Gestão Completa', desc: 'Painel admin para quadras, reservas, pagamentos e notas fiscais.' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Reserve sua quadra de areia com praticidade
          </h1>
          <p className="mt-6 text-lg text-primary-100">
            Sistema completo de locação de quadras. Cadastre-se, escolha o horário e jogue!
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/cadastro">
              <Button size="lg" variant="light">
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
        <h2 className="mb-10 text-center text-2xl font-bold text-dark">Como funciona</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                <Icon className="text-primary-600" size={28} />
              </div>
              <h3 className="font-bold text-dark">{title}</h3>
              <p className="mt-2 text-sm text-muted">{desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
