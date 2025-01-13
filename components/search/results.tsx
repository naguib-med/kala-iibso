import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

// This would normally come from your database
const mockResults = [
    {
        id: 1,
        title: "Toyota Camry 2020",
        price: 2500000,
        location: "Djibouti Ville",
        condition: "Très bon",
        image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500",
        category: "vehicles"
    },
    {
        id: 2,
        title: "iPhone 13 Pro",
        price: 150000,
        location: "Ali Sabieh",
        condition: "Comme neuf",
        image: "https://images.unsplash.com/photo-1585399000475-c4146b074882?w=500",
        category: "electronics"
    },
    {
        id: 3,
        title: "Canapé moderne",
        price: 85000,
        location: "Djibouti Ville",
        condition: "Bon état",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        category: "home"
    },
    {
        id: 4,
        title: "Montre de luxe",
        price: 200000,
        location: "Tadjourah",
        condition: "Neuf",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        category: "fashion"
    }
]

type SearchResultsProps = {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}


export function SearchResults({ searchParams }: SearchResultsProps) {
    // Filter results based on search params
    const filteredResults = mockResults.filter(item => {
        const minPrice = typeof searchParams.minPrice === 'string' ? parseInt(searchParams.minPrice) : undefined
        const maxPrice = typeof searchParams.maxPrice === 'string' ? parseInt(searchParams.maxPrice) : undefined
        const category = typeof searchParams.category === 'string' ? searchParams.category : undefined
        const location = typeof searchParams.location === 'string' ? searchParams.location : undefined
        const condition = typeof searchParams.condition === 'string' ? searchParams.condition : undefined

        if (category && item.category !== category) return false
        if (location && item.location.toLowerCase() !== location) return false
        if (condition && item.condition.toLowerCase() !== condition) return false
        if (minPrice && item.price < minPrice) return false
        if (maxPrice && item.price > maxPrice) return false
        return true
    })

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Résultats de recherche</h1>
                <p className="text-muted-foreground">{filteredResults.length} annonces trouvées</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResults.map((item) => (
                    <Link key={item.id} href={`/listings/${item.id}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-square relative">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="mt-1 text-lg font-bold">{item.price.toLocaleString()} DJF</p>
                                <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                                    <span>{item.location}</span>
                                    <span>{item.condition}</span>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}