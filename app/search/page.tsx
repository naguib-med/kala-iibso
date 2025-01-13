import { Suspense } from "react"
import { SearchFilters } from "@/components/search/filters"
import { SearchResults } from "@/components/search/results"
import { SearchSkeleton } from "@/components/search/skeleton"

interface SearchPageProps {
    params: { [key: string]: string | string[] | undefined }
    searchParams: { [key: string]: string | string[] | undefined }
}

export default function SearchPage({
    searchParams,
}: SearchPageProps) {
    return (
        <div className="container py-6 md:py-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                <SearchFilters />
                <div className="md:col-span-3">
                    <Suspense fallback={<SearchSkeleton />}>
                        <SearchResults searchParams={searchParams} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export const metadata = {
    title: 'Search Results',
    description: 'Search through our marketplace',
}