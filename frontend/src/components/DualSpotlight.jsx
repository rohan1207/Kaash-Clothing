import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Metallic text helper class
const metallicTextClass =
  "bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 text-transparent bg-clip-text drop-shadow-[0_6px_30px_rgba(0,0,0,0.25)]";

const PulseHotspot = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative h-8 w-8 rounded-full bg-white/95 flex items-center justify-center shadow-md"
      aria-label="Show product details"
    >
      {/* inner dot */}
      <span className="h-2.5 w-2.5 bg-black/80 rounded-full" />
      {/* concentric pings */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-white/40 animate-ping" />
      <span
        className="absolute inline-flex h-full w-full rounded-full bg-white/30 animate-ping"
        style={{ animationDelay: "250ms" }}
      />
      <span
        className="absolute inline-flex h-full w-full rounded-full bg-white/20 animate-ping"
        style={{ animationDelay: "500ms" }}
      />
    </button>
  );
};

// utility clamp
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const ProductCard = ({ item, anchorPx, bounds, onClose }) => {
  const cardRef = useRef(null);
  const [size, setSize] = useState({ w: 320, h: 400 });

  // measure card size for accurate clamping
  useEffect(() => {
    if (!cardRef.current) return;
    const measure = () => {
      const r = cardRef.current.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, []);

  const padding = 16; // safe margin inside panel
  const gap = 16; // space between hotspot and card
  // pick side direction primarily based on hotspot position
  const preferRight = anchorPx.x < bounds.w / 2;
  const sideForCalc = preferRight ? "right" : "left";
  const desiredLeft =
    anchorPx.x + (sideForCalc === "right" ? gap : -size.w - gap);
  const left = clamp(
    desiredLeft,
    padding,
    Math.max(padding, bounds.w - size.w - padding)
  );
  const top = clamp(
    anchorPx.y - size.h / 2,
    padding,
    Math.max(padding, bounds.h - size.h - padding)
  );
  const isCardRightOfHotspot = left > anchorPx.x; // card sits to the right side of hotspot
  const pointerSide = isCardRightOfHotspot ? "left" : "right";
  const pointerTop = clamp(anchorPx.y - top, 12, size.h - 12);

  return (
    <>
      {/* spotlight glow behind card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.45, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pointer-events-none absolute rounded-full"
        style={{
          left: anchorPx.x,
          top: anchorPx.y,
          width: 420,
          height: 420,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient( circle at center, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.35) 40%, rgba(255,255,255,0.0) 65%)",
          filter: "blur(2px)",
        }}
      />

      {/* the product card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 6 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="absolute z-20 w-[320px] bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-stone-200/50 overflow-hidden"
        style={{ left, top }}
      >
        {/* Product Image with overlay gradient */}
        <div className="relative group overflow-hidden">
          <img
            src={item.cardImage || item.image}
            alt={item.title}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3">
          {/* Title and Price */}
          <div className="space-y-1.5">
            <h3 className="text-base font-light text-stone-900 tracking-wide leading-snug">
              {item.title}
            </h3>
            {item.price && (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-light text-stone-900">
                  {item.price.replace('₹', '')}
                </span>
                <span className="text-xs text-stone-500 font-light">DHS</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />

          {/* CTA Button */}
          <Link
            to={item.cta || "/shop"}
            className="block w-full"
            onClick={onClose}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-10 bg-stone-900 text-white text-xs font-light tracking-[0.2em] uppercase rounded-full hover:bg-stone-800 transition-colors duration-300 flex items-center justify-center gap-2 group"
            >
              View Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          </Link>
        </div>

        {/* Close button - Refined */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm text-stone-700 flex items-center justify-center shadow-lg border border-stone-200/50 hover:bg-white hover:scale-110 transition-all duration-300 z-10"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-4 w-4"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* notch pointer toward hotspot */}
        <div
          className="absolute w-3 h-3 bg-white/95 backdrop-blur-xl border-l border-t border-stone-200/50 rotate-45"
          style={{
            [pointerSide]: -6,
            top: pointerTop,
            marginTop: -6,
            boxShadow: "-4px -4px 8px rgba(0,0,0,0.05)",
          }}
        />
      </motion.div>
    </>
  );
};

const Panel = ({ item, index, isOpen, setOpen }) => {
  // hotspot position percentages relative to panel
  const {
    hotspot = { x: "52%", y: "62%", side: index === 0 ? "left" : "right" },
  } = item;
  const panelRef = useRef(null);
  const [bounds, setBounds] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!panelRef.current) return;
    const update = () => {
      const r = panelRef.current.getBoundingClientRect();
      setBounds({ w: r.width, h: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(panelRef.current);
    return () => ro.disconnect();
  }, []);

  const pct = (v) =>
    typeof v === "string" && v.endsWith("%") ? parseFloat(v) / 100 : v;
  const anchorPx = {
    x: bounds.w * pct(hotspot.x ?? "50%"),
    y: bounds.h * pct(hotspot.y ?? "50%"),
    side: hotspot.side || (index === 0 ? "left" : "right"),
  };

  return (
    <div
      ref={panelRef}
      className="relative h-screen select-none overflow-hidden"
    >
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* gradient at bottom to ensure button readability */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />

      {/* Metallic title */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div
          className="leading-[0.85]"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {item.titleLines.map((t, i) => (
            <div
              key={i}
              className={`text-white/90 ${metallicTextClass} font-light`}
            >
              <span className="block text-[12vw] md:text-[8.5vw] lg:text-[7.2vw] tracking-wide">
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hotspot */}
      <div
        className="absolute"
        style={{
          top: hotspot.y,
          left: hotspot.x,
          transform: "translate(-50%, -50%)",
        }}
      >
        <PulseHotspot onClick={() => setOpen(isOpen ? null : index)} />
      </div>

      {/* Popup card */}
      <AnimatePresence>
        {isOpen === index && (
          <ProductCard
            item={item}
            anchorPx={anchorPx}
            bounds={bounds}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>

      {/* Discover button */}
      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center">
        <button className="px-8 py-3 border border-white text-white text-sm tracking-[0.2em] hover:bg-white/50 hover:text-black transition-colors rounded-full">
          discover
        </button>
      </div>
    </div>
  );
};

const DualSpotlight = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const data = items || [
    {
      title: "Dunes of Mauve",
      titleLines: ["Dunes of ", "Mauve"],
      image: "/kaashkurti1.JPG",
      cardImage: "/kaashkurti1.JPG",
      price: "₹320.00",
      hotspot: { x: "56%", y: "64%", side: "left" },
      cta: "/shop",
    },
    {
      title: "Al Khadra Grace",
      titleLines: ["Al Khadra ", "Grace"],
      image: "/kaashkurti2.JPG",
      cardImage: "/kaashkurti2.JPG",
      price: "₹320.00",
      hotspot: { x: "47%", y: "66%", side: "right" },
      cta: "/shop",
    },
  ];

  return (
    <section className="w-full h-screen grid grid-cols-1 md:grid-cols-2">
      {data.map((item, idx) => (
        <Panel
          key={idx}
          item={item}
          index={idx}
          isOpen={openIndex}
          setOpen={setOpenIndex}
        />
      ))}
    </section>
  );
};

export default DualSpotlight;
