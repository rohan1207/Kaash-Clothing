import React from "react";
import ProductShowcase from "../components/ProductShowcase";
import PremiumHero from "../components/PremiumHero";
import Ribbon from "../components/Ribbon";
import DualSpotlight from "../components/DualSpotlight";
import Hero from "../components/Hero";
const HomePage = () => {
  return (
    <div>
      {/* Premium fullscreen hero */}

      {/* Dual product spotlight section */}

      {/* Existing sections */}
      <Hero />
      <Ribbon />
      <DualSpotlight />
      <ProductShowcase />
      <PremiumHero />
    </div>
  );
};

export default HomePage;
