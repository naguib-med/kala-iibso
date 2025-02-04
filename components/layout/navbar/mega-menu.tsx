'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { categories } from './categories';
import { cn } from '@/lib/utils';
import { ChevronRight, Star } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// First, let's define our interfaces
interface SubCategory {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

interface MainCategory {
  title: string;
  icon: LucideIcon;
  items: SubCategory[];
}

export function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <NavigationMenu>
      {/* Rest of the code remains the same until the categories mapping */}
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className="h-9 px-4 py-2"
            onMouseEnter={() => {
              setActiveCategory(null);
            }}
          >
            Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[1200px] grid-cols-8 gap-0">
              {/* Categories List */}
              <div className="col-span-2 border-r">
                <ScrollArea className="h-[600px]">
                  {(categories as MainCategory[]).map((category) => (
                    <Button
                      key={category.title}
                      variant="ghost"
                      className={cn(
                        'w-full justify-start rounded-none border-l-2 border-transparent px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                        activeCategory === category.title &&
                          'border-l-2 border-l-primary bg-accent'
                      )}
                      onMouseEnter={() => {
                        setActiveCategory(category.title);
                      }}
                    >
                      <category.icon className="mr-2 h-4 w-4" />
                      <span className="flex-1">{category.title}</span>
                      <ChevronRight className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  ))}
                </ScrollArea>
              </div>

              {/* Subcategories */}
              <div className="col-span-4 p-6 bg-accent/5">
                {activeCategory ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium text-lg">
                          {activeCategory}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {
                            (categories as MainCategory[]).find(
                              (c) => c.title === activeCategory
                            )?.items.length
                          }{' '}
                          subcategories
                        </p>
                      </div>
                      <Button variant="link" size="sm" asChild>
                        <Link
                          href={`/marketplace/category/${activeCategory.toLowerCase()}`}
                        >
                          View All
                        </Link>
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {(categories as MainCategory[])
                        .find((c) => c.title === activeCategory)
                        ?.items.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="group flex items-center gap-3 py-2 pr-2 rounded-lg hover:bg-accent/50"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/30 group-hover:bg-primary/10">
                              <item.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="font-medium text-lg flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Popular Categories
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Most visited categories
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {(categories as MainCategory[])
                        .slice(0, 6)
                        .map((category) => (
                          <Link
                            key={category.title}
                            href={`/marketplace/category/${category.title.toLowerCase()}`}
                            className="group flex items-center gap-3 py-2 pr-2 rounded-lg hover:bg-accent/50"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/30 group-hover:bg-primary/10">
                              <category.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                            </div>
                            <span className="text-sm font-medium group-hover:text-primary">
                              {category.title}
                            </span>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
