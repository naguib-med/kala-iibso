// components/listings/listings-header.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export function ListingsHeader() {
    return (
        <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
            <div className="container py-12 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            Explorez nos annonces
                        </h1>
                        <p className="text-lg text-muted-foreground mb-6">
                            Trouvez exactement ce que vous cherchez parmi des milliers d'articles
                        </p>
                        <Button asChild size="lg" className="rounded-full">
                            <Link href="/listings/new">
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Publier une annonce
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un article..."
                                className="pl-12 h-14 rounded-full text-lg shadow-lg"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}