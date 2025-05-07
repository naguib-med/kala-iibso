'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';
import { UserNav } from './user-nav';
import { SearchCommand } from './search-command';
import { CartSheet } from '@/components/cart/cart-sheet';
import {
  Building2,
  Menu,
  Heart,
  PlusCircle,
  Search,
  ChevronDown,
  MapPin,
} from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch wishlist count
  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/wishlist');
          if (response.ok) {
            const data = await response.json();
            setWishlistCount(data.length);
          }
        } catch (error) {
          console.error('Error fetching wishlist count:', error);
        }
      }
    };

    fetchWishlistCount();
  }, [session]);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {/* Main Navbar with Glassmorphism */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'relative border-b bg-background/85 backdrop-blur transition-all duration-300 ease-in-out supports-[backdrop-filter]:bg-background/50',
          isScrolled && 'shadow-lg shadow-primary/5'
        )}
      >
        <div className="container">
          {/* Upper Navbar Section */}
          <div className="flex h-16 items-center justify-between">
            {/* Left Section with Logo Animation */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </motion.button>

              <Link href="/" className="group flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Building2 className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-primary/80" />
                </motion.div>
                <span className="text-xl font-bold tracking-tight">
                  Djibouti
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Home
                  </span>
                </span>
              </Link>

              {/* Animated Location Selector */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="hidden cursor-pointer items-center gap-2 rounded-full border bg-background/50 px-4 py-2 text-sm shadow-sm transition-colors duration-300 hover:border-primary/50 hover:bg-primary/5 lg:flex"
              >
                <MapPin className="h-4 w-4 text-primary" />
                <span>Djibouti ville</span>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </div>

            {/* Center Section - Enhanced Search */}
            <div className="hidden flex-1 max-w-xl px-8 lg:block">
              <div className="relative">
                <SearchCommand />
              </div>
            </div>

            {/* Right Section with Micro-interactions */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden"
                onClick={() => setShowSearchBar(!showSearchBar)}
              >
                <Search className="h-5 w-5" />
              </motion.button>

              {session ? (
                <>
                  {/* Animated Post Ad Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden lg:block"
                  >
                    <Button asChild className="group gap-2 bg-gradient-to-r from-primary to-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                      <Link href="/listings/new">
                        <PlusCircle className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                        Publier une annonce
                      </Link>
                    </Button>
                  </motion.div>

                  {/* Interactive Icon Buttons */}
                  <div className="flex items-center gap-1">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden sm:block"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative group"
                        asChild
                      >
                        <Link href="/wishlist">
                          <Heart className="h-5 w-5 transition-colors duration-300 group-hover:text-red-500" />
                          {wishlistCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>
                      </Button>
                    </motion.div>
                    <CartSheet />
                    <UserNav />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      className="transition-colors duration-300 hover:bg-primary/5 hover:text-primary"
                      asChild
                    >
                      <Link href="/auth/signin">Se connecter</Link>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="bg-gradient-to-r from-primary to-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                      asChild
                    >
                      <Link href="/auth/signup">S&apos;inscrire</Link>
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          {/* Animated Mobile Search Bar */}
          <AnimatePresence>
            {showSearchBar && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="py-2 lg:hidden"
              >
                <SearchCommand />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lower Navbar with Category Navigation */}
          <div className="hidden border-t py-2 lg:block">
            <div className="flex items-center justify-between">
              <MainNav />
              {session && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group flex gap-2 text-muted-foreground transition-colors duration-300 hover:text-primary"
                    asChild
                  >
                    <Link href="/wishlist">
                      <Heart className="h-4 w-4 transition-colors duration-300 group-hover:text-red-500" />
                      Mes favoris
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Animated Progress Bar */}
        {isScrolled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-primary/20 via-primary to-primary/20"
          />
        )}
      </motion.header>

      {/* Enhanced Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}