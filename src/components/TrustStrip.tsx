import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, ScanLine, BarChart3, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const TrustStrip: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollRef = useRef<number>();

  const items = [
    { 
      icon: <Activity className="w-5 h-5 text-cyan-400" />, 
      label: 'Attack Path Detection',
      description: 'Real-time threat mapping'
    },
    { 
      icon: <Database className="w-5 h-5 text-purple-400" />, 
      label: 'Graph Intelligence',
      description: 'Visual security analysis'
    },
    { 
      icon: <ScanLine className="w-5 h-5 text-blue-400" />, 
      label: 'Misconfiguration Analysis',
      description: 'Automated compliance checks'
    },
    { 
      icon: <BarChart3 className="w-5 h-5 text-green-400" />, 
      label: 'Risk Insights',
      description: 'Predictive risk scoring'
    },
    // Duplicate items for infinite scroll effect
    { 
      icon: <Activity className="w-5 h-5 text-cyan-400" />, 
      label: 'Attack Path Detection',
      description: 'Real-time threat mapping'
    },
    { 
      icon: <Database className="w-5 h-5 text-purple-400" />, 
      label: 'Graph Intelligence',
      description: 'Visual security analysis'
    },
    { 
      icon: <ScanLine className="w-5 h-5 text-blue-400" />, 
      label: 'Misconfiguration Analysis',
      description: 'Automated compliance checks'
    },
    { 
      icon: <BarChart3 className="w-5 h-5 text-green-400" />, 
      label: 'Risk Insights',
      description: 'Predictive risk scoring'
    },
  ];

  const startAutoScroll = () => {
    if (scrollContainerRef.current) {
      const scroll = () => {
        if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
          
          // Scroll right
          scrollContainerRef.current.scrollBy({ left: 1, behavior: 'auto' });
          
          // Check if we've reached the end, then reset to start
          if (scrollLeft >= scrollWidth - clientWidth) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: 'auto' });
          }
        }
      };

      // Start continuous scrolling
      autoScrollRef.current = setInterval(scroll, 30);
      setIsAutoScrolling(true);
    }
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      setIsAutoScrolling(false);
    }
  };

  const toggleAutoScroll = () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      if (direction === 'left') {
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  useEffect(() => {
    // Start auto-scroll when component mounts
    startAutoScroll();
    
    // Cleanup on unmount
    return () => {
      stopAutoScroll();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      }
    },
  };

  return (
    <div className="py-12 border-y border-gray-800 bg-black/40 backdrop-blur-sm relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
      
      <div className="relative z-20">
        {/* Auto-scroll control button */}
        <button
          onClick={toggleAutoScroll}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-gray-900/80 border border-gray-700 backdrop-blur-sm transition-all duration-300 hover:bg-cyan-500/20 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-400"
          aria-label={isAutoScrolling ? "Pause auto-scroll" : "Start auto-scroll"}
        >
          {isAutoScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Manual scroll buttons */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-gray-900/80 border border-gray-700 backdrop-blur-sm transition-all duration-300 ${
            canScrollLeft 
              ? 'hover:bg-cyan-500/20 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-400' 
              : 'opacity-50 cursor-not-allowed text-gray-600'
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-gray-900/80 border border-gray-700 backdrop-blur-sm transition-all duration-300 ${
            canScrollRight 
              ? 'hover:bg-cyan-500/20 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-400' 
              : 'opacity-50 cursor-not-allowed text-gray-600'
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <motion.div 
          className="container mx-auto px-16 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div 
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto scroll-smooth py-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            } as React.CSSProperties}
          >
            {items.map((item, index) => (
              <motion.div 
                key={`${index}-${item.label}`}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="flex flex-col items-center gap-3 group cursor-pointer flex-shrink-0 min-w-[200px]"
              >
                <motion.div 
                  className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all duration-300"
                  whileHover={{ 
                    rotate: [0, 5, -5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {item.icon}
                </motion.div>
                <div className="text-center">
                  <span className="text-gray-400 font-bold group-hover:text-white transition-colors text-sm md:text-base tracking-wide uppercase block">
                    {item.label}
                  </span>
                  <span className="text-gray-600 text-xs mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrustStrip;
