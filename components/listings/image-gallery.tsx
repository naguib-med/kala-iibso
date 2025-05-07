'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
    Share2,
    Heart,
    ChevronRight,
    ChevronLeft,
    Expand,
    X
} from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export function ImageGalleryWithMagnify({ images, title }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [liked, setLiked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // États pour la loupe
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [[x, y], setXY] = useState([0, 0]);
    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);

    const imageContainerRef = useRef<HTMLDivElement>(null);
    const thumbnailScrollRef = useRef<HTMLDivElement>(null);

    // Configuration de la loupe
    const magnifierHeight = 200;
    const magnifierWidth = 200;
    const zoomLevel = 2.5;

    // Gestion des événements de la loupe
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        const { width, height } = element.getBoundingClientRect();
        setSize([width, height]);
        setShowMagnifier(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        const { top, left } = element.getBoundingClientRect();

        const x = e.clientX - left;
        const y = e.clientY - top;
        setXY([x, y]);
    };

    const handleMouseLeave = () => {
        setShowMagnifier(false);
    };

    // Navigation
    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        scrollToThumbnail(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        scrollToThumbnail(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    };

    const scrollToThumbnail = (index: number) => {
        if (thumbnailScrollRef.current) {
            const thumbnailElement = thumbnailScrollRef.current.children[index] as HTMLElement;
            if (thumbnailElement) {
                thumbnailElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    };

    // Modal
    const openModal = () => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    // Partage
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Découvrez cette annonce : ${title}`,
                url: window.location.href,
            }).catch(console.log);
        } else {
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Lien copié dans le presse-papier !'))
                .catch(console.log);
        }
    };

    // Navigation au clavier
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="relative">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Miniatures verticales */}
                <div className="md:w-20 flex-shrink-0 hidden md:block">
                    <div
                        ref={thumbnailScrollRef}
                        className="flex md:flex-col gap-2 overflow-y-auto max-h-[600px] sticky top-24"
                        style={{ scrollbarWidth: 'thin' }}
                    >
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`relative flex-shrink-0 w-16 h-16 md:w-full md:aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentIndex === index ? 'border-primary' : 'border-transparent hover:border-primary/50'
                                    }`}
                            >
                                <Image
                                    src={image}
                                    alt={`${title} - miniature ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image principale avec loupe */}
                <div className="flex-1 relative">
                    <div
                        ref={imageContainerRef}
                        className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-none"
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Image principale */}
                        <Image
                            src={images[currentIndex] || '/placeholder-product.png'}
                            alt={`${title} - image ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            priority={true}
                        />

                        {/* Zone de sélection (carré qui suit la souris) */}
                        {showMagnifier && (
                            <div
                                style={{
                                    position: "absolute",
                                    border: "1px solid rgba(0, 0, 0, 0.2)",
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    left: `${x - magnifierWidth / (2 * zoomLevel)}px`,
                                    top: `${y - magnifierHeight / (2 * zoomLevel)}px`,
                                    width: `${magnifierWidth / zoomLevel}px`,
                                    height: `${magnifierHeight / zoomLevel}px`,
                                    pointerEvents: "none"
                                }}
                            />
                        )}

                        {/* Boutons de navigation */}
                        <div className="absolute inset-0 flex items-center justify-between p-2 md:p-4">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full transition-all duration-300 shadow-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full transition-all duration-300 shadow-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Contrôles en haut à droite */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full shadow-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openModal();
                                }}
                            >
                                <Expand className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full shadow-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare();
                                }}
                            >
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant={liked ? "destructive" : "secondary"}
                                className="rounded-full shadow-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLiked(!liked);
                                }}
                            >
                                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                            </Button>
                        </div>
                    </div>

                    {/* Loupe (zone agrandie) */}
                    {showMagnifier && (
                        <div
                            className="absolute pointer-events-none border border-gray-300 bg-white shadow-lg z-50"
                            style={{
                                left: `calc(100% + 20px)`,
                                top: 0,
                                width: "400px",
                                height: "400px",
                                backgroundImage: `url('${images[currentIndex]}')`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                                backgroundPositionX: `${-x * zoomLevel + 200}px`,
                                backgroundPositionY: `${-y * zoomLevel + 200}px`
                            }}
                        />
                    )}

                    {/* Miniatures horizontales pour mobile */}
                    <div className="md:hidden flex gap-2 mt-4 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${currentIndex === index ? 'border-primary' : 'border-transparent hover:border-primary/50'
                                    }`}
                            >
                                <Image
                                    src={image}
                                    alt={`${title} - miniature ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal plein écran */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-[100vw] h-[100vh] p-0 m-0">
                    <div className="relative h-full w-full bg-black flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <Image
                                src={images[currentIndex]}
                                alt={`${title} - vue agrandie`}
                                fill
                                className="object-contain"
                            />
                        </div>

                        {/* Contrôles du modal */}
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={closeModal}
                            className="absolute top-4 right-4"
                        >
                            <X className="h-4 w-4" />
                        </Button>

                        {/* Navigation dans le modal */}
                        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full"
                                onClick={goToPrevious}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full"
                                onClick={goToNext}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Indicateur de position */}
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                            <span className="text-white bg-black/50 px-4 py-2 rounded-full">
                                {currentIndex + 1} / {images.length}
                            </span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}