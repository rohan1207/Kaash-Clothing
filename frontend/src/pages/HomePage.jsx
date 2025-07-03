import React from "react";


import ProductShowcase from "../components/ProductShowcase";
import LandingComponent from "../components/LandingComponent"; 
import DiscountBanner  from "../components/DiscountBanner "; 

const HomePage = () => {
  return (
    <div>
     
     <LandingComponent />
     <DiscountBanner  />
   
      <ProductShowcase />
    </div>
  );
};

export default HomePage;
