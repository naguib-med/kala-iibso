"use client";

import { motion } from "framer-motion";
import {
    Building2,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    ArrowRight,
    Heart,
    Store,
    Shield,
    Languages,
    HelpCircle,
    FileText,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FooterLinkProps {
    href: string;
    children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => (
    <motion.a
        href={href}
        className="group flex items-center gap-2 text-sm text-muted-foreground/80 transition-colors duration-300 hover:text-primary"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
        <ChevronRight className="h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {children}
    </motion.a>
);

interface SocialButtonProps {
    icon: React.ElementType;
    href: string;
    label: string;
}


const SocialButton = ({ icon: Icon, href, label }: SocialButtonProps) => (
    <motion.a
        href={href}
        aria-label={label}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="group rounded-full bg-primary/5 p-2 transition-colors duration-300 hover:bg-primary/10"
    >
        <Icon className="h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
    </motion.a>
);

export function Footer() {
    return (
        <footer className="relative w-full border-t bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-4 top-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -right-4 top-40 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="container relative">
                {/* Main Footer Content */}
                <div className="grid gap-16 py-16 md:grid-cols-2 lg:grid-cols-6">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center gap-2">
                                <Building2 className="h-6 w-6 text-primary" />
                                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-xl font-bold text-transparent">
                                    Suuq Djibouti
                                </span>
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-muted-foreground/80">
                                La première plateforme de marché en ligne à Djibouti. Nous connectons les acheteurs
                                et les vendeurs pour créer des opportunités commerciales uniques.
                            </p>

                            {/* Contact Info */}
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <span>+253 XX XX XX XX</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <span>contact@suuq.dj</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>Djibouti ville, Djibouti</span>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="mt-6 flex gap-3">
                                <SocialButton icon={Facebook} href="#" label="Facebook" />
                                <SocialButton icon={Twitter} href="#" label="Twitter" />
                                <SocialButton icon={Instagram} href="#" label="Instagram" />
                                <SocialButton icon={Linkedin} href="#" label="LinkedIn" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Quick Links Sections */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid gap-8 sm:grid-cols-2 lg:col-span-2"
                    >
                        <div>
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <Shield className="h-4 w-4 text-primary" />
                                Services
                            </h3>
                            <ul className="mt-4 space-y-2">
                                <li><FooterLink href="#">Comment ça marche</FooterLink></li>
                                <li><FooterLink href="#">Tarification</FooterLink></li>
                                <li><FooterLink href="#">Programme VIP</FooterLink></li>
                                <li><FooterLink href="#">Devenir vendeur</FooterLink></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <HelpCircle className="h-4 w-4 text-primary" />
                                Support
                            </h3>
                            <ul className="mt-4 space-y-2">
                                <li><FooterLink href="#">Centre d&apos;aide</FooterLink></li>
                                <li><FooterLink href="#">FAQ</FooterLink></li>
                                <li><FooterLink href="#">Contactez-nous</FooterLink></li>
                                <li><FooterLink href="#">Signaler un problème</FooterLink></li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Legal Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="lg:col-span-1"
                    >
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            <FileText className="h-4 w-4 text-primary" />
                            Légal
                        </h3>
                        <ul className="mt-4 space-y-2">
                            <li><FooterLink href="#">Conditions d&apos;utilisation</FooterLink></li>
                            <li><FooterLink href="#">Politique de confidentialité</FooterLink></li>
                            <li><FooterLink href="#">Protection des données</FooterLink></li>
                            <li><FooterLink href="#">Mentions légales</FooterLink></li>
                        </ul>
                    </motion.div>

                    {/* App Download Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-1"
                    >
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            <Store className="h-4 w-4 text-primary" />
                            Application Mobile
                        </h3>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Téléchargez notre application pour une meilleure expérience
                        </p>
                        <div className="mt-4 flex flex-col gap-3">
                            <Button
                                variant="outline"
                                className="group flex items-center gap-2 transition-colors duration-300 hover:bg-primary hover:text-white"
                            >
                                App Store
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                            <Button
                                variant="outline"
                                className="group flex items-center gap-2 transition-colors duration-300 hover:bg-primary hover:text-white"
                            >
                                Play Store
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Language Selector */}
                <div className="border-t border-border/50 py-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Languages className="h-4 w-4" />
                            <select className="bg-transparent">
                                <option value="fr">Français</option>
                            </select>
                        </div>
                    </motion.div>
                </div>

                {/* Copyright Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="border-t border-border/50 py-6"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                            © 2024 Suuq Djibouti. Tous droits réservés.
                        </p>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            Fait avec <Heart className="h-4 w-4 text-red-500" /> par{" "}
                            <a
                                href="https://www.linkedin.com/in/naguib-mohamed-mahamoud-3baa96177/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary"
                            >
                                Naguib Med
                            </a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}