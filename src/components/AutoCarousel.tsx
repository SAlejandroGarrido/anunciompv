import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface AutoCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  interval?: number;
}

export const AutoCarousel = ({ images, alt, className, interval = 3000 }: AutoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}>
        <span className="text-gray-400 text-sm">Sem imagem</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <img 
        src={images[0]} 
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <img 
        src={images[currentIndex]} 
        alt={`${alt} - ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-700 ease-in-out"
      />
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ease-in-out ${
              index === currentIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

interface ManualCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export const ManualCarousel = ({ images, alt, className }: ManualCarouselProps) => {
  if (images.length === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}>
        <span className="text-gray-400 text-sm">Sem imagem</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <img 
        src={images[0]} 
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <Carousel className={`w-full h-full ${className}`}>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <img 
              src={image} 
              alt={`${alt} - ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out hover:scale-110" />
      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out hover:scale-110" />
    </Carousel>
  );
};