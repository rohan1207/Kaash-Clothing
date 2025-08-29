import React from "react";


import ProductShowcase from "../components/ProductShowcase";
import Hero from "../components/Hero"; 
import Ribbon from "../components/Ribbon"; 
// import DiscountBanner  from "../components/DiscountBanner "; 

const HomePage = () => {
  return (
    <div>
     
     <Hero />
     
   <Ribbon/>
      <ProductShowcase />
    </div>
  );
};

export default HomePage;
