import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status] = useState({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  };

  const benefits = [
    'Offres exclusives et promotions',
    'Nouveaux produits en avant-première',
    "Conseils d'achat personnalisés",
    'Événements spéciaux',
  ];

  return (
    <section className="bg-gradient-to-b from-primary to-secondary">
      <div className="container py-24">
        <Card className="overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Content Section */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-2 text-primary">
                <Bell className="h-5 w-5 animate-bounce" />
                <span className="text-sm font-medium">Newsletter Suuq</span>
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Ne manquez aucune opportunité
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Rejoignez notre communauté de plus de 50,000 membres et recevez
                les meilleures offres directement dans votre boîte mail.
              </p>

              <div className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-8">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-input bg-white px-10 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="group h-12 gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Inscription...
                      </span>
                    ) : (
                      <>
                        S&apos;abonner
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>

                {status.type && (
                  <Alert
                    className={`mt-4 ${
                      status.type === 'success'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    <AlertDescription>{status.message}</AlertDescription>
                  </Alert>
                )}
              </form>

              <p className="mt-4 text-xs text-muted-foreground">
                En vous inscrivant, vous acceptez de recevoir des emails
                marketing de Suuq. Vous pouvez vous désinscrire à tout moment.
              </p>
            </div>

            {/* Image Section */}
            <div className="relative hidden bg-primary/5 lg:block">
              <div className="absolute inset-0">
                <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>
              <div className="relative h-full">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="rounded-xl p-8 shadow-lg bg-secondary">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10">
                        <Mail className="h-full w-full p-3 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Newsletter Premium</h3>
                        <p className="text-sm text-muted-foreground">
                          Offres exclusives et contenus VIP
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
