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
import { categories } from './categories';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

export function CategoryMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className="h-9 px-4 py-2"
            onMouseEnter={() => setActiveCategory(null)}
          >
            Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[800px] grid-cols-5 gap-0">
              <div className="col-span-2 border-r">
                {categories.map((category) => (
                  <Button
                    key={category.title}
                    variant="ghost"
                    className={cn(
                      'w-full justify-start rounded-none border-l-2 border-transparent px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                      activeCategory === category.title &&
                        'border-l-2 border-l-primary bg-accent'
                    )}
                    onMouseEnter={() => setActiveCategory(category.title)}
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.title}
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                ))}
              </div>
              <div className="col-span-3 p-4 bg-accent/5">
                {activeCategory ? (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      {activeCategory}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {categories
                        .find((c) => c.title === activeCategory)
                        ?.items.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="flex items-center gap-2 text-sm hover:text-primary"
                          >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {categories.slice(0, 6).map((category) => (
                      <Link
                        key={category.title}
                        href={`/marketplace/category/${category.title.toLowerCase()}`}
                        className="flex items-center gap-2 text-sm hover:text-primary"
                      >
                        <category.icon className="h-4 w-4" />
                        {category.title}
                      </Link>
                    ))}
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
