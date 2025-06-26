import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./components/AdminLayout";

import Dashboard from "./pages/Dashboard";
import ManageProducts from "./pages/ManageProducts";
import DiscountManagement from "./pages/DiscountManagement";
import AddProduct from "./pages/Addproduct";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage
              onLogin={() => setIsAuthenticated(true)}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="manage-products" element={<ManageProducts />} />
                  <Route path="add-product" element={<AddProduct />} />
                  <Route path="discounts" element={<DiscountManagement />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
