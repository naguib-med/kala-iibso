'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Car,
  Smartphone,
  Sofa,
  ShoppingBag,
  Search,
  ArrowRight,
  Star,
  Shield,
  Truck,
  Clock,
  Users,
  PhoneCall,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { NewsletterSection } from '@/components/NewsletterSection';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [, setActiveIndex] = useState(0);
  const [stats, setStats] = useState({ users: 0, listings: 0, sales: 0 });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate stats when in view
  useEffect(() => {
    setStats({
      users: 100,
      listings: 15,
      sales: 50,
    });
  }, []);

  // Auto-scroll featured items
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    {
      icon: Car,
      title: 'Véhicules',
      description: 'Voitures, motos et pièces détachées',
    },
    {
      icon: Smartphone,
      title: 'Électronique',
      description: 'Téléphones, ordinateurs et accessoires',
    },
    { icon: Sofa, title: 'Maison', description: 'Meubles et décoration' },
    {
      icon: ShoppingBag,
      title: 'Mode',
      description: 'Vêtements et accessoires',
    },
  ];

  const testimonials = [
    {
      name: 'Ahmed Hassan',
      role: 'Vendeur Vérifié',
      content:
        "Suuq m'a permis de développer mon business. La plateforme est intuitive et la communauté est active.",
      rating: 5,
    },
    {
      name: 'Fatouma Ali',
      role: 'Acheteuse Régulière',
      content:
        'Je trouve toujours ce que je cherche à des prix raisonnables. Le service client est excellent !',
      rating: 5,
    },
    {
      name: 'Mohamed Omar',
      role: 'Vendeur Pro',
      content:
        'La meilleure plateforme de vente à Djibouti. Les outils pour les vendeurs sont très utiles.',
      rating: 4,
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Paiements Sécurisés',
      description: 'Transactions protégées et sécurisées',
    },
    {
      icon: Truck,
      title: 'Livraison Rapide',
      description: 'Service de livraison dans tout Djibouti',
    },
    {
      icon: MessageSquare,
      title: 'Chat Intégré',
      description: 'Communication facile entre acheteurs et vendeurs',
    },
    {
      icon: CheckCircle,
      title: 'Vendeurs Vérifiés',
      description: 'Système de vérification des vendeurs',
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 transform transition-transform duration-500"
          style={{ transform: `translateY(${isScrolled ? '10%' : '0'})` }}
        >
          <Image
            src="https://images.unsplash.com/photo-1735327854928-6111ac6105c8?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Djibouti marketplace"
            fill
            className="object-cover brightness-50 transition-all duration-700 hover:scale-105"
            priority
          />
        </div>
        <div className="container relative flex h-full flex-col items-center justify-center text-center">
          <div className="transform space-y-6 transition-all duration-700 hover:scale-105">
            <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
              Suuq Djibouti
            </h1>
            <p className="max-w-2xl text-lg text-white/90 md:text-xl lg:text-2xl">
              Découvrez le plus grand marché en ligne de Djibouti. Une
              expérience d&apos;achat et de vente unique.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="group px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/browse" className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Parcourir
                  <ArrowRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/sell">Vendre un article</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories with Hover Effects */}
      <section className="container py-16">
        <h2 className="text-4xl font-bold tracking-tight">
          Explorez nos catégories
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="group cursor-pointer overflow-hidden p-8 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col items-center text-center">
                <category.icon className="h-16 w-16 transform text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-primary/80" />
                <h3 className="mt-6 text-2xl font-semibold">
                  {category.title}
                </h3>
                <p className="mt-4 text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-primary/5 py-24">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <Users className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-4xl font-bold">
                {stats.users.toLocaleString()}+
              </h3>
              <p className="mt-2 text-muted-foreground">Utilisateurs Actifs</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShoppingBag className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-4xl font-bold">
                {stats.listings.toLocaleString()}+
              </h3>
              <p className="mt-2 text-muted-foreground">Annonces Publiées</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-4xl font-bold">
                {stats.sales.toLocaleString()}+
              </h3>
              <p className="mt-2 text-muted-foreground">Ventes Réalisées</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Pourquoi choisir Suuq ?</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Nous vous offrons la meilleure expérience d&apos;achat et de vente
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center">
                <feature.icon className="h-12 w-12 text-primary transition-transform duration-300 group-hover:scale-110" />
                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-primary/5">
        <div className="container">
          <h2 className="text-center text-4xl font-bold">
            Ce que disent nos utilisateurs
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10">
                    <Users className="h-full w-full p-2 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="mt-4 text-muted-foreground">
                  {testimonial.content}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container pb-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold">Besoin d&apos;aide ?</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Notre équipe est là pour vous aider et répondre à vos questions
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <PhoneCall className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Par téléphone</h3>
                  <p className="text-muted-foreground">+253 XX XX XX XX</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MessageSquare className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Par message</h3>
                  <p className="text-muted-foreground">support@suuq.dj</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Card className="p-6">
              <h3 className="text-xl font-semibold">Envoyez-nous un message</h3>
              <form className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom complet</label>
                  <input
                    type="text"
                    className="w-full rounded-md border p-2"
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-md border p-2"
                    placeholder="votre@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    className="h-32 w-full rounded-md border p-2"
                    placeholder="Votre message..."
                  />
                </div>
                <Button className="w-full">Envoyer</Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
