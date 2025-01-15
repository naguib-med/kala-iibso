"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { categories } from "./categories";
import { SearchCommand } from "./search-command";
import { X, Building2, ShoppingBag, Search, ChevronRight } from "lucide-react";

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="w-full pr-0 sm:max-w-md">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between pr-4 border-b pb-4">
                        <Link
                            href="/"
                            className="flex items-center"
                            onClick={() => onClose()}
                        >
                            <Building2 className="h-6 w-6 mr-2" />
                            <span className="font-bold">DjiboutiHome</span>
                        </Link>
                        <Button
                            variant="ghost"
                            className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                            onClick={() => onClose()}
                        >
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>

                    <div className="py-4 px-4 border-b">
                        <Button
                            variant="outline"
                            className="w-full justify-start text-muted-foreground"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Search everything...
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 px-4">
                        <div className="space-y-4 py-4">
                            <div className="flex flex-col space-y-2">
                                <Link
                                    href="/marketplace"
                                    onClick={() => onClose()}
                                    className={cn(
                                        "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
                                        pathname === "/marketplace" && "bg-accent"
                                    )}
                                >
                                    <div className="flex items-center">
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        Marketplace
                                    </div>
                                    <ChevronRight className="h-4 w-4 opacity-50" />
                                </Link>
                            </div>

                            <div className="py-2">
                                <h4 className="text-sm font-medium mb-2 px-3">Categories</h4>
                                <Accordion type="single" collapsible className="w-full">
                                    {categories.map((category) => (
                                        <AccordionItem key={category.title} value={category.title}>
                                            <AccordionTrigger className="py-2 hover:no-underline">
                                                <div className="flex items-center">
                                                    <category.icon className="mr-2 h-4 w-4" />
                                                    <span className="text-sm">{category.title}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="pl-6 space-y-2">
                                                    {category.items.map((item) => (
                                                        <Link
                                                            key={item.title}
                                                            href={item.href}
                                                            onClick={() => onClose()}
                                                            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                                                        >
                                                            <div className="flex items-center">
                                                                <item.icon className="mr-2 h-4 w-4" />
                                                                {item.title}
                                                            </div>
                                                            <ChevronRight className="h-4 w-4 opacity-50" />
                                                        </Link>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </SheetContent>

            {/* Search Dialog */}
            <div className="hidden">
                <SearchCommand
                    open={isSearchOpen}
                    onOpenChange={setIsSearchOpen}
                    onSelect={() => {
                        setIsSearchOpen(false);
                        onClose();
                    }}
                />
            </div>
        </Sheet>
    );
}