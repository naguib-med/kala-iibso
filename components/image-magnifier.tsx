'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  magnifierHeight?: number;
  magnifierWidth?: number;
  zoomLevel?: number;
}

export default function ImageMagnifier({
  src,
  alt,
  width = 600,
  height = 600,
  magnifierHeight = 200,
  magnifierWidth = 200,
  zoomLevel = 2.5
}: ImageMagnifierProps) {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Mise à jour de la taille de l'image quand elle est chargée
    if (imgRef.current) {
      setSize([imgRef.current.offsetWidth, imgRef.current.offsetHeight]);
    }
  }, [imgRef.current]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    // Mise à jour de la taille de l'image
    const element = e.currentTarget;
    const { width, height } = element.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Mise à jour de la position du curseur
    const element = e.currentTarget;
    const { top, left } = element.getBoundingClientRect();

    // Calcul de la position relative du curseur
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;
    setXY([x, y]);
  };

  return (
    <div
      className="relative inline-block"
      style={{ height: `${height}px`, width: `${width}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image principale */}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        className="object-contain"
        priority
      />

      {/* Loupe */}
      {showMagnifier && (
        <div
          style={{
            display: showMagnifier ? "" : "none",
            position: "absolute",
            
            // Position de la loupe
            left: `${x - magnifierWidth / 2}px`,
            top: `${y - magnifierHeight / 2}px`,
            
            // Apparence de la loupe
            width: `${magnifierWidth}px`,
            height: `${magnifierHeight}px`,
            border: "1px solid #ddd",
            backgroundColor: "white",
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            pointerEvents: "none",
            borderRadius: "50%",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            
            // Calcul de la position du zoom
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
            backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`
          }}
        />
      )}

      {/* Carré de sélection sur l'image principale (optionnel) */}
      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            border: "2px solid rgba(0, 0, 0, 0.3)",
            borderRadius: "4px",
            left: `${x - magnifierWidth / (2 * zoomLevel)}px`,
            top: `${y - magnifierHeight / (2 * zoomLevel)}px`,
            width: `${magnifierWidth / zoomLevel}px`,
            height: `${magnifierHeight / zoomLevel}px`,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            pointerEvents: "none"
          }}
        />
      )}
    </div>
  );
}