'use client';

import { useRef, useEffect } from 'react';
import { ScheduleDay } from './ScheduleDay';
import { scheduleData } from './scheduleData';
import { Utensils, BookOpen, Users, Clock } from 'lucide-react';

export function ScheduleSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const animationId = useRef<number | null>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDown.current = true;
      container.style.cursor = 'grabbing';
      container.style.userSelect = 'none';
      startX.current = e.pageX - container.offsetLeft;
      scrollLeft.current = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown.current = false;
      container.style.cursor = 'grab';
      container.style.userSelect = '';
    };

  const handleMouseUp = () => {
    isDown.current = false;
    container.style.cursor = 'grab';
    container.style.userSelect = '';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX.current) * 0.8; // Reduzido para mais suavidade
    const targetScrollLeft = scrollLeft.current - walk;
    
    // Cancela animação anterior
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
    }
    
    // Animação suave com easing
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const startScroll = container.scrollLeft;
    const distance = targetScrollLeft - startScroll;
    const duration = 100; // ms
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      container.scrollLeft = startScroll + (distance * easedProgress);
      
      if (progress < 1) {
        animationId.current = requestAnimationFrame(animate);
      } else {
        animationId.current = null;
      }
    };
    
    animationId.current = requestAnimationFrame(animate);
  };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
          Programação do Retiro
        </h2>
        <p className="text-center text-muted-foreground mb-8 text-sm sm:text-base px-4 animate-pulse">
          ↔️ Arraste para os lados para ver os outros dias da programação
        </p>
        
        <div className="relative mb-8">
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide touch-pan-x cursor-grab select-none scroll-smooth-custom"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollPadding: '1rem'
            }}
          >
            <div className="flex gap-4 pb-4 px-4">
              {scheduleData.map((day, index) => (
                <div key={index} className="snap-start select-none">
                  <ScheduleDay day={day} />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center flex-wrap gap-3 sm:gap-6 p-3 sm:p-4 bg-white rounded-lg shadow-sm border max-w-xs sm:max-w-full">
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium">Refeições</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-green-600" />
              <span className="text-xs sm:text-sm font-medium">Palestras</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-yellow-600" />
              <span className="text-xs sm:text-sm font-medium">Atividades</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-xs sm:text-sm font-medium">Logística</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}