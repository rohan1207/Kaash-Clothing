import React, { createContext, useState, useContext, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// Translation dictionaries
const translations = {
  en: {
    // Navbar
    menu: "Menu",
    search: "Search our catalog",
    login: "Log in",
    account: "Account",
    wishlist: "Wishlist",
    cart: "Cart",
    home: "Home",
    shop: "Shop",
    newArrivals: "New Arrivals",
    about: "About",
    contact: "Contact",
    
    // Common
    viewAll: "View All",
    viewMore: "View More",
    addToCart: "Add to Cart",
    addToBag: "Add to Bag",
    continueShopping: "Continue Shopping",
    goToCart: "Go to Cart",
    items: "Items",
    subtotal: "Subtotal",
    
    // Product
    size: "Size",
    selectSize: "Select Size",
    quickView: "Quick View",
    
    // Wishlist
    yourWishlist: "Your Wishlist",
    addAllToBag: "Add All to Bag",
    clearWishlist: "Clear Wishlist",
    emptyWishlist: "Your wishlist is empty",
    discoverCollection: "Discover our curated collection and save your favorite pieces for later",
    
    // Account
    myAccount: "My Account",
    welcomeBack: "Welcome back",
    profile: "Profile",
    orders: "Orders",
    addresses: "Addresses",
    settings: "Settings",
    logout: "Logout",
    personalInfo: "Personal Information",
    orderHistory: "Order History",
    
    // Auth
    signIn: "Sign In",
    signUp: "Sign Up",
    createAccount: "Create Account",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone Number",
    forgotPassword: "Forgot password?",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    
    // Footer
    aboutUs: "About Us",
    customerService: "Customer Service",
    followUs: "Follow Us",
    
    // Homepage
    curatedForYou: "Curated for You",
    timelessDesign: "Timeless Design",
    artisanalQuality: "Artisanal Quality",
    sustainableCraft: "Sustainable Craft",
    timelessDesignDesc: "Each piece is designed to transcend seasons, blending classic silhouettes with a modern sensibility.",
    artisanalQualityDesc: "We partner with skilled artisans who use traditional techniques to create garments of exceptional quality.",
    sustainableCraftDesc: "Committed to sustainability, we source eco-friendly materials and practice ethical production methods.",
    discoverSelection: "Discover our handpicked selection of signature pieces, where timeless style meets modern elegance.",
    
    // Cart
    yourBag: "Your Bag",
    emptyCart: "Your cart is empty.",
    
    // Product
    off: "OFF",
    
    // Buttons
    close: "Close",
    viewDetails: "View Details",
    discoverMore: "Discover More",
    
    // Shop Page
    ourCollection: "Our Collection",
    ourCollectionDesc: "Timeless pieces crafted with love. Each kurti tells a story of tradition, elegance, and modern grace.",
    loadingCollection: "Loading collection...",
    filterAndSort: "Filter & Sort",
    piece: "piece",
    s: "s",
    noProductsFound: "No products found. Try adjusting your filters.",
    filters: "Filters",
    category: "Category",
    priceRange: "Price Range",
    sortBy: "Sort By",
    newestFirst: "Newest First",
    priceLowToHigh: "Price: Low to High",
    priceHighToLow: "Price: High to Low",
    
    // Footer
    stayInTouch: "Stay in Touch",
    newsletterDesc: "Subscribe to our newsletter for exclusive updates, new collections, and special offers.",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",
    footerBrandDesc: "Timeless elegance, modern design. Discover curated collections that define luxury.",
    allProducts: "All Products",
    collections: "Collections",
    ourStory: "Our Story",
    sustainability: "Sustainability",
    support: "Support",
    faq: "FAQ",
    shippingAndReturns: "Shipping & Returns",
    privacyPolicy: "Privacy Policy",
    allRightsReserved: "Kaash Co.Clothing. All Rights Reserved.",
    designedBy: "Designed & developed by",
    
    // Product Categories
    all: "All",
    kurtis: "Kurtis",
    
    // Product Materials
    cotton: "Cotton",
    rayon: "Rayon",
    silk: "Silk",
    linen: "Linen",
    
    // Product Tags
    festive: "Festive",
    embroidered: "Embroidered",
    eveningWear: "Evening Wear",
    casual: "Casual",
    floral: "Floral",
    summer: "Summer",
    
    // Colors
    black: "Black",
    gold: "Gold",
    blue: "Blue",
    white: "White",
    red: "Red",
    green: "Green",
    pink: "Pink",
    yellow: "Yellow",
    
    // Note: Product names and descriptions remain in English
    // as they are proper names/detailed content from the database
  },
  ar: {
    // Navbar
    menu: "القائمة",
    search: "ابحث في الكتالوج",
    login: "تسجيل الدخول",
    account: "الحساب",
    wishlist: "المفضلة",
    cart: "السلة",
    home: "الرئيسية",
    shop: "المتجر",
    newArrivals: "الوافدون الجدد",
    about: "من نحن",
    contact: "اتصل بنا",
    
    // Common
    viewAll: "عرض الكل",
    viewMore: "عرض المزيد",
    addToCart: "أضف إلى السلة",
    addToBag: "أضف إلى الحقيبة",
    continueShopping: "متابعة التسوق",
    goToCart: "الذهاب إلى السلة",
    items: "عناصر",
    subtotal: "المجموع الفرعي",
    
    // Product
    size: "المقاس",
    selectSize: "اختر المقاس",
    quickView: "عرض سريع",
    
    // Wishlist
    yourWishlist: "قائمة الأمنيات",
    addAllToBag: "إضافة الكل إلى الحقيبة",
    clearWishlist: "مسح قائمة الأمنيات",
    emptyWishlist: "قائمة الأمنيات فارغة",
    discoverCollection: "اكتشف مجموعتنا المختارة واحفظ القطع المفضلة لديك",
    
    // Account
    myAccount: "حسابي",
    welcomeBack: "مرحبا بعودتك",
    profile: "الملف الشخصي",
    orders: "الطلبات",
    addresses: "العناوين",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    personalInfo: "المعلومات الشخصية",
    orderHistory: "سجل الطلبات",
    
    // Auth
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    createAccount: "إنشاء حساب جديد",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    phone: "رقم الهاتف",
    forgotPassword: "نسيت كلمة المرور؟",
    dontHaveAccount: "ليس لديك حساب؟",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    
    // Footer
    aboutUs: "من نحن",
    customerService: "خدمة العملاء",
    followUs: "تابعنا",
    
    // Homepage
    curatedForYou: "منتقاة لك",
    timelessDesign: "تصميم خالد",
    artisanalQuality: "جودة حرفية",
    sustainableCraft: "صناعة مستدامة",
    timelessDesignDesc: "كل قطعة مصممة لتتجاوز المواسم، مع مزج من الصور الكلاسيكية والحساسية العصرية.",
    artisanalQualityDesc: "نتعاون مع حرفيين ماهرين يستخدمون تقنيات تقليدية لإنشاء ملابس بجودة استثنائية.",
    sustainableCraftDesc: "ملتزمون بالاستدامة، نحصل على مواد صديقة للبيئة ونمارس أساليب إنتاج أخلاقية.",
    discoverSelection: "اكتشف مجموعتنا المختارة من القطع المميزة، حيث يلتقي الأناقة الخالدة مع التصميم العصري.",
    
    // Cart
    yourBag: "حقيبتك",
    emptyCart: "سلة التسوق فارغة.",
    
    // Product
    off: "خصم",
    
    // Buttons
    close: "إغلاق",
    viewDetails: "عرض التفاصيل",
    discoverMore: "اكتشف المزيد",
    
    // Shop Page
    ourCollection: "مجموعتنا",
    ourCollectionDesc: "قطع خالدة مصنوعة بحب. كل كورتي تروي قصة من التقاليد والأناقة والرقي الحديث.",
    loadingCollection: "جاري تحميل المجموعة...",
    filterAndSort: "تصفية وترتيب",
    piece: "قطعة",
    s: "",
    noProductsFound: "لم يتم العثور على منتجات. حاول ضبط الفلاتر.",
    filters: "الفلاتر",
    category: "الفئة",
    priceRange: "نطاق السعر",
    sortBy: "ترتيب حسب",
    newestFirst: "الأحدث أولاً",
    priceLowToHigh: "السعر: من الأقل إلى الأعلى",
    priceHighToLow: "السعر: من الأعلى إلى الأقل",
    
    // Footer
    stayInTouch: "ابقى على تواصل",
    newsletterDesc: "اشترك في نشرتنا الإخبارية للحصول على تحديثات حصرية ومجموعات جديدة وعروض خاصة.",
    enterEmail: "أدخل بريدك الإلكتروني",
    subscribe: "اشترك",
    footerBrandDesc: "أناقة خالدة، تصميم عصري. اكتشف مجموعات منسقة تحدد الفخامة.",
    allProducts: "جميع المنتجات",
    collections: "المجموعات",
    ourStory: "قصتنا",
    sustainability: "الاستدامة",
    support: "الدعم",
    faq: "الأسئلة الشائعة",
    shippingAndReturns: "الشحن والإرجاع",
    privacyPolicy: "سياسة الخصوصية",
    allRightsReserved: "كاش للملابس. جميع الحقوق محفوظة.",
    designedBy: "تصميم وتطوير بواسطة",
    
    // Product Categories
    all: "الكل",
    kurtis: "كورتي",
    
    // Product Materials
    cotton: "قطن",
    rayon: "رايون",
    silk: "حرير",
    linen: "كتان",
    
    // Product Tags
    festive: "احتفالي",
    embroidered: "مطرز",
    eveningWear: "ملابس مسائية",
    casual: "غير رسمي",
    floral: "زهري",
    summer: "صيفي",
    
    // Colors
    black: "أسود",
    gold: "ذهبي",
    blue: "أزرق",
    white: "أبيض",
    red: "أحمر",
    green: "أخضر",
    pink: "وردي",
    yellow: "أصفر",
    
    // Note: Product names and descriptions remain in English
    // as they are proper names/detailed content from the database
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to English
    const saved = localStorage.getItem("language");
    return saved || "en";
  });

  useEffect(() => {
    // Save language preference
    localStorage.setItem("language", language);
    
    // Set document direction and lang attribute
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    
    // Add/remove RTL class for custom styling
    if (language === "ar") {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const value = {
    language,
    changeLanguage,
    t,
    isRTL: language === "ar",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
