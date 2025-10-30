import React, { useEffect, useRef, useState } from 'react';

const ModernVideoScroll = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerHeight = rect.height;
      
      // Calculate scroll progress more precisely
      const scrollStart = rect.top;
      const scrollEnd = rect.bottom - windowHeight;
      const totalScrollDistance = containerHeight;
      
      // Progress from 0 to 1 as we scroll through the component
      let progress = 0;
      if (scrollStart <= 0) {
        progress = Math.min(1, Math.abs(scrollStart) / (totalScrollDistance * 0.7));
      }
      
      setScrollProgress(progress);

      // Video play/pause logic
      if (progress > 0.1 && !isVideoPlaying && videoRef.current) {
        videoRef.current.play().catch(() => {});
        setIsVideoPlaying(true);
      } else if (progress <= 0.05 && isVideoPlaying && videoRef.current) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVideoPlaying]);

  // Animation calculations
  const borderScale = Math.max(0, 1 - scrollProgress * 1.2); // Shrinks inward
  const borderOpacity = Math.max(0, 1 - scrollProgress * 1.5); // Fades out
  const videoScale = 1 + scrollProgress * 0.3; // Expands to fill screen
  
  // Card animations with staggered timing
  const card1Progress = Math.max(0, Math.min(1, (scrollProgress - 0.3) * 2.5));
  const card2Progress = Math.max(0, Math.min(1, (scrollProgress - 0.5) * 2.5));
  
  const card1Transform = card1Progress * 100;
  const card2Transform = card2Progress * 100;

  return (
    <div className="relative">
     
      
      {/* Main scroll component */}
      <div className="relative w-full h-[400vh] bg-white" ref={containerRef}>
        {/* Sticky viewport - z-50 to overlap navbar */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-white z-50">
          
          {/* Animated black border/background */}
          <div
            className="absolute inset-0 z-10 transition-all duration-700 ease-out"
            style={{
              transform: `scale(${borderScale})`,
              opacity: borderOpacity,
              background: 'white',
              transformOrigin: 'center',
            }}
          />
          
          {/* Main video container */}
          <div 
            className="relative z-20 transition-all duration-700 ease-out"
            style={{
              transform: `scale(${videoScale})`,
              width: 'calc(100vw - 120px)',
              height: 'calc(100vh - 120px)',
            }}
          >
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23000'/%3E%3C/svg%3E"
              >
                <source src="/video11.mp4" type="video/mp4" />
              </video>
              
              {/* Hero text overlay */}
              <div className="absolute inset-0 flex items-center justify-start pl-12 md:pl-20">
                <div 
                  className="text-white max-w-lg transition-all duration-1000 ease-out"
                  style={{
                    opacity: Math.max(0.3, 1 - scrollProgress * 2),
                    transform: `translateX(${scrollProgress * -100}px)`,
                  }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    Let That <br />
                    Beauty In You <br />
                    Shine
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Card 1 - Top Right */}
          <div
            className="absolute top-1/2 right-8 md:right-16 z-30 bg-white/95 backdrop-blur-sm rounded-md p-6 shadow-2xl max-w-sm transition-all duration-1000 ease-out"
            style={{
              transform: `translate(${100 - card1Transform}%, -50%)`,
              opacity: card1Progress,
            }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Explore Edgy Everyday Wear
            </h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Discover bold, street-smart styles crafted for comfort and everyday confidence.
            </p>
            <button className="w-full py-3 px-6 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-105">
              Explore
            </button>
          </div>

          {/* Card 2 - Bottom Left */}
          <div
            className="absolute bottom-1/2 left-8 md:left-16 z-30 bg-white/95 backdrop-blur-sm rounded-md p-6 shadow-2xl max-w-sm transition-all duration-1000 ease-out"
            style={{
              transform: `translate(${-100 + card2Transform}%, 50%)`,
              opacity: card2Progress,
            }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              100% Original
            </h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              At Kaash, we take pride in offering 100% original products, crafted with premium materials.
            </p>
            <button className="w-full py-3 px-6 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-105">
              Explore
            </button>
          </div>

          {/* Scroll indicator */}
          {/* <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-500"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 3),
            }}
          >
            <div className="flex flex-col items-center text-white/80">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full mb-2 relative">
                <div 
                  className="w-1 h-3 bg-white/70 rounded-full absolute left-1/2 top-2 transform -translate-x-1/2 animate-bounce"
                />
              </div>
              <span className="text-sm font-medium">Scroll to explore</span>
            </div>
          </div> */}

          {/* Progress indicator */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30">
            <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer after component */}
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-2xl px-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Ready to Shop?</h2>
          <p className="text-xl text-gray-600 mb-8">Discover our full collection of street-style fashion</p>
          <button className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
            Browse Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernVideoScroll;