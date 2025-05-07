import React, { useState, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
                style={{
                    backgroundImage: "url('https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1800')",
                    transform: `translateY(${isScrolled ? '10%' : '0'})`,
                    filter: 'brightness(0.5)'
                }}
            />

            {/* Content */}
            <div className="container relative mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
                <div className="space-y-6 transform transition-all duration-700 hover:scale-105 max-w-3xl">
                    <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
                        Vendez
                    </h1>
                    <p className="text-lg text-white/90 md:text-xl lg:text-2xl max-w-2xl mx-auto">
                        Achetez et vendez des articles de mode, des objets pour la maison et plus encore, le tout à partir de votre smartphone.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-md mx-auto mt-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Que cherchez-vous ?"
                                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-lg transition-all duration-300"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <button className="group px-8 py-4 bg-violet-600 text-white rounded-full font-medium transition-all duration-300 hover:bg-violet-700 hover:scale-105 flex items-center justify-center gap-2">
                            <span>Parcourir</span>
                            <ArrowRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                        </button>
                        <button className="px-8 py-4 bg-white text-violet-700 rounded-full font-medium transition-all duration-300 hover:bg-gray-100 hover:scale-105">
                            Vendre un article
                        </button>
                    </div>
                </div>
            </div>

            {/* Gradient Overlay at the Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
        </section>
    );
};

export default Hero;