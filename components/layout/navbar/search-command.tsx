'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { categories } from './categories';
import {
  Search,
  ArrowRight,
  History,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'product' | 'category' | 'recent' | 'trending';
  title: string;
  description?: string;
  image?: string;
  href: string;
  icon?: React.ComponentType<{ className: string }>;
}

interface SearchCommandProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: () => void;
}

export function SearchCommand({
  open: controlledOpen,
  onOpenChange,
  onSelect,
}: SearchCommandProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingItems] = useState<SearchResult[]>([
    {
      id: 'trend-1',
      type: 'trending',
      title: 'Vintage Furniture Collection',
      description: 'Up to 40% off',
      image:
        'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=100&h=100&fit=crop',
      href: '/marketplace/collections/vintage',
    },
    {
      id: 'trend-2',
      type: 'trending',
      title: 'Smart Home Devices',
      description: 'New arrivals',
      image:
        'https://images.unsplash.com/photo-1558002038-1055907df827?w=100&h=100&fit=crop',
      href: '/marketplace/collections/smart-home',
    },
  ]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;

  const handleOpenChange = (open: boolean) => {
    if (!isControlled) {
      setOpen(open);
    }
    onOpenChange?.(open);
  };

  const addToRecentSearches = (search: string) => {
    const updated = [
      search,
      ...recentSearches.filter((s) => s !== search),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSelect = (result: SearchResult) => {
    if (result.type !== 'recent') {
      addToRecentSearches(result.title);
    }
    router.push(result.href);
    handleOpenChange(false);
    onSelect?.();
  };

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }

    // Search in categories
    const categoryResults = categories.flatMap((category) =>
      category.items
        .filter((item) =>
          item.title.toLowerCase().includes(value.toLowerCase())
        )
        .map((item) => ({
          id: `category-${item.title}`,
          type: 'category' as const,
          title: item.title,
          description: `in ${category.title}`,
          href: item.href,
          icon: item.icon,
        }))
    );

    // Mock product search with explicit type annotation
    const productResults: SearchResult[] = [
      {
        id: '1',
        type: 'product',
        title: 'Modern Sofa',
        description: 'Furniture • $599',
        image:
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop',
        href: '/marketplace/product/1',
      },
      {
        id: '2',
        type: 'product',
        title: 'Smart TV',
        description: 'Electronics • $899',
        image:
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=100&fit=crop',
        href: '/marketplace/product/2',
      },
    ].filter((product) =>
      product.title.toLowerCase().includes(value.toLowerCase())
    ) as SearchResult[];

    setResults([...categoryResults, ...productResults]);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-96"
        onClick={() => handleOpenChange(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search everything...</span>
        <kbd className="pointer-events-none absolute right-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
        <CommandInput
          placeholder="Search products, categories..."
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center justify-center py-6">
              <Sparkles className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                No results found. Try a different search term.
              </p>
            </div>
          </CommandEmpty>

          {query.length < 2 && (
            <>
              {recentSearches.length > 0 && (
                <>
                  <CommandGroup heading="Recent Searches">
                    {recentSearches.map((search) => (
                      <CommandItem
                        key={search}
                        onSelect={() =>
                          handleSelect({
                            id: search,
                            type: 'recent',
                            title: search,
                            href: `/search?q=${encodeURIComponent(search)}`,
                          })
                        }
                      >
                        <History className="mr-2 h-4 w-4" />
                        {search}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              <CommandGroup heading="Trending Now">
                {trendingItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-2 py-2"
                  >
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image!}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium truncate">
                          {item.title}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-50" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {results.length > 0 && (
            <>
              <CommandGroup heading="Categories">
                {results
                  .filter((result) => result.type === 'category')
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        {result.icon && (
                          <result.icon className="mr-2 h-4 w-4" />
                        )}
                        <span>{result.title}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-2">
                          {result.description}
                        </span>
                        <ArrowRight className="h-4 w-4 opacity-50" />
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Products">
                {results
                  .filter((result) => result.type === 'product')
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className="flex items-center gap-2 py-2"
                    >
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={result.image!}
                          alt={result.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {result.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {result.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-50" />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
