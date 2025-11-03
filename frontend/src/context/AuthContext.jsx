import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Dummy user data - replace with API calls later
const DUMMY_USERS = [
  {
    id: "1",
    email: "user@123",
    password: "user@123",
    firstName: "kaash",
    lastName: "clothing",
    phone: "+91 98765 43210",
    dateOfBirth: "1995-06-15",
    gender: "Female",
    address: {
      street: "123 Fashion Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },
    orders: [
      {
        id: "ORD-2024-001",
        date: "2024-10-15",
        status: "Delivered",
        total: 4599,
        items: 3,
      },
      {
        id: "ORD-2024-002",
        date: "2024-10-28",
        status: "In Transit",
        total: 2899,
        items: 2,
      },
    ],
    createdAt: "2024-01-15",
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user session:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function - replace with API call later
  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = DUMMY_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem("user", JSON.stringify(userWithoutPassword));
          resolve({ success: true, user: userWithoutPassword });
        } else {
          reject({ success: false, message: "Invalid email or password" });
        }
      }, 800); // Simulate API delay
    });
  };

  // Signup function - replace with API call later
  const signup = async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = DUMMY_USERS.find((u) => u.email === userData.email);
        
        if (existingUser) {
          reject({ success: false, message: "Email already exists" });
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          ...userData,
          orders: [],
          createdAt: new Date().toISOString(),
        };

        // Remove password before storing
        const { password, ...userWithoutPassword } = newUser;
        
        // Add to dummy users array
        DUMMY_USERS.push(newUser);
        
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        resolve({ success: true, user: userWithoutPassword });
      }, 800); // Simulate API delay
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Update profile - replace with API call later
  const updateProfile = async (updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        resolve({ success: true, user: updatedUser });
      }, 800);
    });
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
