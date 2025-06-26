import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductShowcase from "../components/ProductShowcase";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <ProductShowcase />
    </div>
  );
};

export default HomePage;
