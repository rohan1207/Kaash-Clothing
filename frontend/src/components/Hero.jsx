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
  videos = ["/video1.mp4", "/video2.mp4", "/video3.mp4"],
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

        {/* CTA Buttons */}
        <div className="mt-4 flex items-center justify-center">
          <div className="group relative flex items-center">
            {/* Arrow Button with initial gap (mr-5) that collapses on hover */}
            <button
              type="button"
              onClick={handleCta}
              aria-label={ctaText}
              className="relative z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-900 transition-all duration-500 ease-out mr-5 group-hover:-mr-8 group-hover:bg-black group-hover:text-white group-hover:rounded-l-full group-hover:h-12 group-hover:w-12"
            >
              <svg
                className="h-6 w-6 transition-all duration-500 ease-out"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Explore Now Button: single-line, expands to the LEFT by increasing left padding and shifting left on hover */}
            <button
              type="button"
              onClick={handleCta}
              className="relative z-10 inline-flex h-14 items-center rounded-full bg-white text-gray-900 border border-transparent px-8 py-3 text-base font-semibold shadow-lg transition-all duration-500 ease-out whitespace-nowrap group-hover:-ml-5 group-hover:pl-24 group-hover:shadow-xl md:px-10 md:text-lg"
            >
              {ctaText}
            </button>
          </div>
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
