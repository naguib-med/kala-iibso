import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Car, Smartphone, Sofa, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1601142634808-38923eb7c560?q=80&w=2070"
          alt="Djibouti marketplace"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="container relative flex h-full flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Bienvenue sur Suuq Djibouti
          </h1>
          <p className="mt-4 max-w-[700px] text-lg text-white md:text-xl">
            Le plus grand marché en ligne de Djibouti. Achetez et vendez en toute simplicité.
          </p>
          <div className="mt-8 flex gap-4">
            <Button size="lg" asChild>
              <Link href="/browse">
                Parcourir les annonces
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/sell">
                Vendre un article
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container">
        <h2 className="text-3xl font-bold tracking-tight">Catégories populaires</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <Car className="h-12 w-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Véhicules</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Voitures, motos et pièces détachées
            </p>
          </Card>
          <Card className="p-6">
            <Smartphone className="h-12 w-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Électronique</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Téléphones, ordinateurs et accessoires
            </p>
          </Card>
          <Card className="p-6">
            <Sofa className="h-12 w-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Maison</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Meubles et décoration
            </p>
          </Card>
          <Card className="p-6">
            <ShoppingBag className="h-12 w-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Mode</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Vêtements et accessoires
            </p>
          </Card>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="container pb-12">
        <h2 className="text-3xl font-bold tracking-tight">Annonces en vedette</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={`https://images.unsplash.com/photo-${i === 1 ? '1583121274602-3e2820c69888' :
                    i === 2 ? '1585399000475-c4146b074882' :
                      i === 3 ? '1505740420928-5e560c06d30e' :
                        '1523275335684-37898b6baf30'}?w=500`}
                  alt="Featured product"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">Produit en vedette {i}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {i === 1 ? "Toyota Camry 2020" :
                    i === 2 ? "iPhone 13 Pro" :
                      i === 3 ? "Canapé moderne" :
                        "Montre de luxe"}
                </p>
                <p className="mt-2 font-semibold">
                  {i === 1 ? "2,500,000 DJF" :
                    i === 2 ? "150,000 DJF" :
                      i === 3 ? "85,000 DJF" :
                        "200,000 DJF"}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}