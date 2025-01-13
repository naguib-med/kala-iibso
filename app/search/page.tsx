import { Suspense } from "react"
import { SearchFilters } from "@/components/search/filters"
import { SearchResults } from "@/components/search/results"
import { SearchSkeleton } from "@/components/search/skeleton"

export default function SearchPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
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