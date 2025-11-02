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
                autoPlay
                preload="auto"
              >
                <source src="/video11.mp4" type="video/mp4" />
              </video>
              
              {/* Hero text overlay */}
              <div className="absolute inset-0 flex items-center justify-start pl-12 md:pl-20">
                <div 
                  className="text-white max-w-lg transition-all duration-1000 ease-out"
                  style={{
                    opacity: Math.max(0.2, 1 - scrollProgress * 2),
                    transform: `translateX(${scrollProgress * -400}px)`,
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

          {/* Card 1 - Top Right - Enhanced Design */}
          <div
            className="absolute top-1/2 right-8 md:right-16 z-30 transition-all duration-700 ease-out will-change-transform"
            style={{
              transform: `translate(${100 - card1Transform}%, -50%)`,
              opacity: card1Progress,
            }}
          >
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-[0_25px_80px_rgba(0,0,0,0.25)] max-w-sm border-2 border-white/80 hover:shadow-[0_30px_100px_rgba(0,0,0,0.3)] transition-all duration-500">
              {/* Decorative accent line */}
              <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-stone-400 to-transparent" />
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-2xl font-light text-stone-900 mb-3 tracking-wide drop-shadow-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Explore Edgy Everyday Wear
                </h3>
                <p className="text-stone-800 mb-6 text-sm leading-relaxed font-normal drop-shadow-sm">
                  Discover bold, street-smart styles crafted for comfort and everyday confidence.
                </p>
                
                {/* Enhanced button with glassmorphic design matching Hero */}
                <button className="group/btn relative inline-flex items-center justify-center w-full rounded-full px-8 py-3.5 text-sm font-semibold text-stone-900 bg-white border-2 border-stone-900 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out hover:bg-stone-900 hover:text-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2 tracking-wide">
                    EXPLORE
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </button>
              </div>
              
              {/* Subtle corner decoration */}
              <div className="absolute bottom-0 right-0 w-24 h-24 opacity-[0.03]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="100" cy="100" r="80" fill="currentColor" className="text-stone-900" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2 - Bottom Left - Enhanced Design */}
          <div
            className="absolute top-18 left-8 md:left-16 z-30 transition-all duration-700 ease-out will-change-transform"
            style={{
              transform: `translate(${-100 + card2Transform}%, 50%)`,
              opacity: card2Progress,
            }}
          >
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-[0_25px_80px_rgba(0,0,0,0.25)] max-w-sm border-2 border-white/80 hover:shadow-[0_30px_100px_rgba(0,0,0,0.3)] transition-all duration-500">
              {/* Decorative accent line */}
              <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-stone-400 to-transparent" />
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-2xl font-light text-stone-900 mb-3 tracking-wide drop-shadow-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  100% Original
                </h3>
                <p className="text-stone-800 mb-6 text-sm leading-relaxed font-normal drop-shadow-sm">
                  At Kaash, we take pride in offering 100% original products, crafted with premium materials.
                </p>
                
                {/* Enhanced button with glassmorphic design matching Hero */}
                <button className="group/btn relative inline-flex items-center justify-center w-full rounded-full px-8 py-3.5 text-sm font-semibold text-stone-900 bg-white border-2 border-stone-900 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out hover:bg-stone-900 hover:text-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2 tracking-wide">
                    EXPLORE
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </button>
              </div>
              
              {/* Subtle corner decoration */}
              <div className="absolute top-0 left-0 w-24 h-24 opacity-[0.03]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="0" cy="0" r="80" fill="currentColor" className="text-stone-900" />
                </svg>
              </div>
            </div>
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