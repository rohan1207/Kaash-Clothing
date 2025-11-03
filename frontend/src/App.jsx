import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import NewArrivals from "./pages/NewArrivals";
import Shop from "./pages/Shop";
import ContactUs from "./pages/ContactUs";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import MobileRestriction from "./components/MobileRestriction";

import SareePage from "./pages/SareePage";
import Top from "./pages/Top";
import WesternPage from "./pages/WesternPage";
import JeansPage from "./pages/JeansPage";
import Kurti from "./pages/Kurti";


const App = () => {
  return (
    <Router>
      <MobileRestriction />
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/saree" element={<SareePage />} />
            <Route path="/top" element={<Top/>} />
            <Route path="/western" element={<WesternPage />} />
           
            <Route path="/jeans" element={<JeansPage />} />
            <Route path="/shop" element={<Shop />} /> 

            <Route path="/about" element={<AboutUs />} />
            <Route path="/new" element={<NewArrivals />} />
            <Route path="/kurti" element={<Kurti />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
