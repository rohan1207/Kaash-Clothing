import React from "react";

/**
 * NewHero – full-screen hero with three parallel background videos on desktop.
 *
 * Props:
 * - videos: string[] (3 sources). Defaults to royalty-free demo URLs; replace with local /public paths.
 * - headline: string
 * - subheadline: string
 * - ctaText: string
 * - onCtaClick: () => void
 * - showRibbon: boolean – toggles the large bottom marquee.
 *
 * Usage:
 * <NewHero videos={["/videos/v1.mp4","/videos/v2.mp4","/videos/v3.mp4"]} />
 */
import { useState } from "react";

const Hero = ({
  videos = ["/video1.mp4", "/maroonvideo.mp4", "/video3.mp4"],
  headline = "TIMELESS FASHION",
  subheadline = "Discover fashion that transcends trends. Elevate style with classic, elegant, and enduring designs.",
  ctaText = "EXPLORE NOW",
  onCtaClick,
  showRibbon = true,
}) => {
  const [hovered, setHovered] = useState(false);
  const handleCta = () => {
    if (typeof onCtaClick === "function") onCtaClick();
  };

  return (
    <section className="relative h-[100svh] w-full overflow-hidden text-white">
      {/* Background videos – three columns on desktop */}
      <div className="absolute inset-0 hidden md:flex">
        <div className="flex h-full w-full">
          {videos.slice(0, 3).map((src, i) => (
            <div key={i} className="relative h-full w-1/3">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={src}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
              />
              {/* slight darken to balance exposure between panels */}
              <div className="absolute inset-0 bg-black/15" />
            </div>
          ))}
        </div>
      </div>

      {/* Single video fallback for mobile */}
      <div className="absolute inset-0 md:hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videos[0]}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Readability gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

      {/* Foreground content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center gap-6 px-6 text-center md:gap-8 md:px-10">
        {/* Main Heading */}
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
            <span className="block">
              TIMELESS <span className="text-[#ec4899]">FASHION</span>
            </span>
            <span className="block">ESSENCE</span>
          </h1>
        </div>

        {/* Subheadline */}
        <p className="max-w-2xl text-lg text-white/90 md:text-xl">
          {subheadline}
        </p>

        {/* CTA Button – glass effect with shine animation */}
        <div className="mt-4 flex items-center justify-center">
          <button
            type="button"
            onClick={handleCta}
            aria-label={ctaText}
            className="group/btn relative inline-flex items-center justify-center rounded-full px-10 py-3 h-14 text-base md:text-lg font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out hover:bg-white/20 hover:border-white/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {ctaText}
              <svg 
                className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </div>

      {/* Local styles for the marquee animation */}
      <style>{`
				@keyframes hero-marquee {
					0% { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}
				.animate-hero-marquee {
					animation: hero-marquee 30s linear infinite;
				}
			`}</style>
    </section>
  );
};

export default Hero;
