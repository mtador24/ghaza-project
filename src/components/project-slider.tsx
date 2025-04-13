
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Create a simpler image interface for the slider that matches what we're passing
export interface SliderImage {
  id?: number;
  projectId?: number;
  url: string;
  alt: string;
}

interface ProjectSliderProps {
  images: SliderImage[];
  autoSlideInterval?: number;
}

export function ProjectSlider({ images, autoSlideInterval = 5000 }: ProjectSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  useEffect(() => {
    if (!autoSlideInterval) return;
    
    const interval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, [autoSlideInterval]);

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">لا توجد صور متاحة</p>
      </div>
    );
  }
  
  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Image Slider */}
      <div className="relative aspect-video overflow-hidden">
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/40 text-white rounded-full hover:bg-black/60"
            onClick={prevSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/40 text-white rounded-full hover:bg-black/60"
            onClick={nextSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex items-center justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? "bg-white w-4" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
