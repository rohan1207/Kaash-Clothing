import React from "react";
import ProductShowcase from "../components/ProductShowcase";
import PremiumHero from "../components/PremiumHero";
import Ribbon from "../components/Ribbon";
import DualSpotlight from "../components/DualSpotlight";
import Hero from "../components/Hero";
import MordernVideoScroll from "../components/ModernVideoScroll";
import ExpertiseCards from "../components/ExpertiseCards";
const HomePage = () => {
  return (
    <div>
      {/* Premium fullscreen hero */}

      {/* Dual product spotlight section */}

      {/* Existing sections */}
      <Hero />
      <Ribbon />
      <DualSpotlight />
      <ExpertiseCards/>
      <ProductShowcase />
      <PremiumHero />
      <MordernVideoScroll />
    </div>
  );
};

export default HomePage;
