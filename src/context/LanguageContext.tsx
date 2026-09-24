import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur';

export interface Translations {
  // Brand & Slogans
  brandName: string;
  brandTagline: string;
  halalCertified: string;
  freshMeatDaily: string;
  
  // Navigation
  navHome: string;
  navMenu: string;
  navFullMenu: string;
  navAbout: string;
  navContact: string;
  navCart: string;
  navTrackOrder: string;
  
  // Hero
  heroTag: string;
  heroWelcome: string;
  heroDescription: string;
  heroOrderOnline: string;
  heroViewMenu: string;
  heroCallNow: string;
  
  // Menu Section
  menuTitle: string;
  menuSubtitle: string;
  searchPlaceholder: string;
  allCategories: string;
  popularChoice: string;
  chefSpecial: string;
  viewDetails: string;
  addToCart: string;
  portionServing: string;
  showAllMenu: string;
  noItemsFound: string;
  
  // Product Detail Page
  productBack: string;
  productSarawanChoice: string;
  productFreshNotice: string;
  verifiedKitchen: string;
  selectPortion: string;
  cookingPreference: string;
  quantity: string;
  subtotal: string;
  buyNow: string;
  dishDescription: string;
  homeDelivery: string;
  cashOnDelivery: string;
  kitchenHours: string;
  directAssistance: string;
  frequentlyOrderedTogether: string;
  
  // About Section
  aboutTag: string;
  aboutTitle: string;
  aboutDescription1: string;
  aboutDescription2: string;
  aboutFeature1: string;
  aboutFeature1Desc: string;
  aboutFeature2: string;
  aboutFeature2Desc: string;
  aboutFeature3: string;
  aboutFeature3Desc: string;
  
  // Contact & Delivery
  contactTag: string;
  contactTitle: string;
  contactDescription: string;
  deliveryHelpline: string;
  deliveryHelplineDesc: string;
  orderOnWhatsapp: string;
  restaurantLocation: string;
  restaurantLocationDesc: string;
  getDirections: string;
  deliveryHoursTitle: string;
  deliveryHoursDesc: string;
  estimatedDeliveryTime: string;
  
  // Cart & Checkout
  cartTitle: string;
  itemsSelected: string;
  cartEmpty: string;
  proceedToCheckout: string;
  proceedToWhatsappOrder: string;
  whatsappOrderTitle: string;
  whatsappOrderSubtitle: string;
  sendOrderViaWhatsapp: string;
  orderSentTitle: string;
  orderSentDesc: string;
  reopenWhatsapp: string;
  orderMoreFood: string;
  deliveryInfoTitle: string;
  fullName: string;
  phoneNumber: string;
  phoneLabel: string;
  phoneHelp: string;
  deliveryAddress: string;
  addressHelp: string;
  whatsappNotice: string;
  specialInstructions: string;
  confirmOrder: string;
  directToWhatsapp: string;
  orOrderDirectlyViaWhatsapp: string;
  totalPayable: string;
  deliveryFee: string;
  copyOrderText: string;
  copiedToClipboard: string;
  
  // Footer
  footerAbout: string;
  quickNav: string;
  timingDelivery: string;
  contactLocation: string;
  allRightsReserved: string;
}

const translations: Record<Language, Translations> = {
  en: {
    brandName: 'Sarawan',
    brandTagline: 'Authentic BBQ • Karahi • Biryani',
    halalCertified: '100% Halal Certified',
    freshMeatDaily: 'Daily Fresh Meat',
    
    navHome: 'Home',
    navMenu: 'Menu',
    navFullMenu: 'Full Menu',
    navAbout: 'About Us',
    navContact: 'Contact & Delivery',
    navCart: 'Cart',
    navTrackOrder: 'Track Order',
    
    heroTag: 'Authentic Pakistani Barbeque & Iron Wok Karahi',
    heroWelcome: 'Welcome to Sarawan',
    heroDescription: 'Experience the timeless taste of open-flame charcoal BBQ, slow-simmered Shinwari & Desi Karahis, aromatic Biryanis, sizzling handis, and authentic fresh naan baked straight from our clay tandoor.',
    heroOrderOnline: 'Order on WhatsApp',
    heroViewMenu: 'View Full Menu',
    heroCallNow: 'Call Reception',
    
    menuTitle: 'Explore Our Flavors',
    menuSubtitle: 'Authentic Pakistani charcoal grill, Shinwari karahi, sizzling handi, and royal desserts prepared fresh to order.',
    searchPlaceholder: 'Search karahi, tikka, kabab, biryani, burgers...',
    allCategories: 'All Dishes',
    popularChoice: 'Popular Choice',
    chefSpecial: "Chef's Special",
    viewDetails: 'View Details',
    addToCart: 'Add to Cart',
    portionServing: 'Serving / Portion:',
    showAllMenu: 'Explore Complete Menu',
    noItemsFound: 'No dishes found matching your search.',
    
    productBack: 'Back',
    productSarawanChoice: 'Sarawan Choice',
    productFreshNotice: 'Prepared live on order with fresh ingredients.',
    verifiedKitchen: 'Verified Kitchen',
    selectPortion: 'Select Portion / Serving Variation:',
    cookingPreference: 'Cooking Preference / Custom Instructions:',
    quantity: 'Quantity:',
    subtotal: 'Subtotal:',
    buyNow: 'Buy Now (Instant Checkout)',
    dishDescription: 'Dish Description & Recipe',
    homeDelivery: 'Home Delivery',
    cashOnDelivery: 'Cash on Delivery',
    kitchenHours: 'Kitchen Hours',
    directAssistance: 'Direct Helpline',
    frequentlyOrderedTogether: 'Frequently Ordered Together',
    
    aboutTag: 'Our Heritage & Quality',
    aboutTitle: 'Honoring Authentic Pakistani Taste at Sarawan',
    aboutDescription1: 'At Sarawan, food is our heritage and passion. From our signature charcoal-grilled Tikkas and juicy Seekh Kababs to traditional Shinwari and Namkeen Karahi recipes, every dish is crafted with pride.',
    aboutDescription2: 'We use strictly 100% Halal fresh meat, whole hand-ground spices, and traditional iron woks over high flame. No artificial additives or food coloring—just pure authentic flavor.',
    aboutFeature1: 'Live Charcoal Barbeque',
    aboutFeature1Desc: 'Marinated for hours and grilled to juicy perfection over real wood charcoal.',
    aboutFeature2: 'Clay Tandoor Hot Breads',
    aboutFeature2Desc: 'Piping hot Roghani, Garlic, and Plain Naans baked fresh to order.',
    aboutFeature3: 'Hygienic Family Dining',
    aboutFeature3Desc: 'Clean kitchen standards, family halls, and insulated fast doorstep delivery.',
    
    contactTag: 'Order Direct & Inquiries',
    contactTitle: 'Contact & Fast Delivery',
    contactDescription: 'Place your order through our website, call our reception directly, or reach us via WhatsApp.',
    deliveryHelpline: 'Delivery & Helpline',
    deliveryHelplineDesc: 'Direct helpline for instant home delivery, takeaways, and food inquiries.',
    orderOnWhatsapp: 'Order on WhatsApp',
    restaurantLocation: 'Restaurant Location',
    restaurantLocationDesc: 'Family dining hall, air-conditioned seating & live outdoor barbeque station.',
    getDirections: 'Get Driving Directions',
    deliveryHoursTitle: 'Delivery & Opening Hours',
    deliveryHoursDesc: 'Hot delivery to your doorstep across the city.',
    estimatedDeliveryTime: 'Standard Delivery Time',
    
    cartTitle: 'Your Order',
    itemsSelected: 'items selected',
    cartEmpty: 'Your food cart is empty. Please select dishes to order.',
    proceedToCheckout: 'Order on WhatsApp',
    proceedToWhatsappOrder: 'Order via WhatsApp',
    whatsappOrderTitle: 'WhatsApp Delivery Order',
    whatsappOrderSubtitle: 'Fresh hot delivery to your doorstep in Karachi (Cash on Delivery)',
    sendOrderViaWhatsapp: 'Send Order on WhatsApp',
    orderSentTitle: 'Order Sent to WhatsApp!',
    orderSentDesc: 'Your order details have been loaded into WhatsApp! Please tap Send in WhatsApp to complete your order with the Sarawan team.',
    reopenWhatsapp: 'Re-open WhatsApp Chat',
    orderMoreFood: 'Order More Dishes',
    deliveryInfoTitle: 'Delivery Information',
    fullName: 'Full Name',
    phoneNumber: 'Phone / Mobile Number',
    phoneLabel: 'Your WhatsApp / Mobile Number',
    phoneHelp: 'Your order will be sent from your WhatsApp number to Sarawan.',
    deliveryAddress: 'Complete Delivery Address',
    addressHelp: 'House #, Street / Block, Landmark, Area (Karachi)',
    whatsappNotice: 'After filling this form, your name, WhatsApp number, and delivery address will be sent directly to Sarawan WhatsApp (0335-3131686) from your logged-in WhatsApp account.',
    specialInstructions: 'Cooking / Delivery Instructions (Optional)',
    confirmOrder: 'Confirm Order on WhatsApp',
    directToWhatsapp: 'Send Order via WhatsApp',
    orOrderDirectlyViaWhatsapp: 'Order Directly Via WhatsApp',
    totalPayable: 'Total Payable on Delivery',
    deliveryFee: 'Standard Delivery Fee',
    copyOrderText: 'Copy Order Text',
    copiedToClipboard: 'Order text copied to clipboard!',
    
    footerAbout: 'Serving the finest authentic charcoal-grilled BBQ, signature Balochi Tikkas, hand-ground Karahis, and aromatic Biryanis. Fresh ingredients, zero compromise on hygiene.',
    quickNav: 'Quick Navigation',
    timingDelivery: 'Timings & Delivery',
    contactLocation: 'Contact & Location',
    allRightsReserved: 'All rights reserved. Authentic Pakistani Barbeque & Fast Food.'
  },
  ur: {
    brandName: 'سروان',
    brandTagline: 'اصلی باربی کیو • کڑاہی • بریانی',
    halalCertified: '۱۰۰٪ خالص حلال مصدقہ',
    freshMeatDaily: 'روزانہ تازہ گوشت',
    
    navHome: 'ہوم',
    navMenu: 'مینو',
    navFullMenu: 'مکمل مینو',
    navAbout: 'ہمارے بارے میں',
    navContact: 'رابطہ و ڈیلیوری',
    navCart: 'کارٹ',
    navTrackOrder: 'آرڈر ٹریک کریں',
    
    heroTag: 'اصلی پاکستانی کوئلہ باربی کیو اور شنواری کڑاہی',
    heroWelcome: 'سروان فاسٹ فوڈ میں خوش آمدید',
    heroDescription: 'دہکتے کوئلوں پر تیار خوشبودار باربی کیو، دیسی گھی والی شنواری اور نمکین کڑاہیاں، ذائقہ دار بریانی، اور تندور کی تازہ گرم روٹیاں۔',
    heroOrderOnline: 'واٹس ایپ پر آرڈر کریں',
    heroViewMenu: 'مکمل مینو دیکھیں',
    heroCallNow: 'ریسیپشن پر کال کریں',
    
    menuTitle: 'ہمارے لذیذ پکوان',
    menuSubtitle: 'اصلی پاکستانی کڑاہی، تازہ کوئلہ باربی کیو، ہانڈی اور میٹھے پکوان جو آپ کے آرڈر پر تازہ تیار کیے جاتے ہیں۔',
    searchPlaceholder: 'کڑاہی، تکہ، کباب، بریانی یا برگر تلاش کریں...',
    allCategories: 'تمام کھانے',
    popularChoice: 'پسندیدہ ترین',
    chefSpecial: 'شیف کا خاص انتخاب',
    viewDetails: 'تفصیل دیکھیں',
    addToCart: 'کارٹ میں شامل کریں',
    portionServing: 'سائز / سرونگ:',
    showAllMenu: 'پورا مینو دریافت کریں',
    noItemsFound: 'آپ کی تلاش کے مطابق کوئی کھانا نہیں ملا۔',
    
    productBack: 'واپس',
    productSarawanChoice: 'سروان خاص',
    productFreshNotice: 'آرڈر پر تازہ اور خالص اجزاء سے تیار۔',
    verifiedKitchen: 'تصدیق شدہ کچن',
    selectPortion: 'سرونگ / وزن کا انتخاب کریں:',
    cookingPreference: 'کھانے کی ترجیح / ہدایات:',
    quantity: 'تعداد:',
    subtotal: 'میزان:',
    buyNow: 'ابھی خریدیں (فوری آرڈر)',
    dishDescription: 'کھانے کی تفصیل و ترکیب',
    homeDelivery: 'گھر پر ڈیلیوری',
    cashOnDelivery: 'کیش آن ڈیلیوری',
    kitchenHours: 'کچن کے اوقات',
    directAssistance: 'براہِ راست ہیلپ لائن',
    frequentlyOrderedTogether: 'اکثر ایک ساتھ منگوائے جانے والے پکوان',
    
    aboutTag: 'ہمارا معیار اور روایت',
    aboutTitle: 'سروان پر اصلی روایتی پاکستانی ذائقہ',
    aboutDescription1: 'سروان میں ہمارا مقصد آپ تک بہترین اور خوشبودار پاکستانی کھانے پہنچانا ہے۔ کوئلے پر پکے رسیلے کباب اور تِکے سے لے کر لذیذ شنواری کڑاہی تک ہر کھانا محبت اور صفائی سے تیار کیا جاتا ہے۔',
    aboutDescription2: 'ہم صرف ۱۰۰٪ حلال تازہ گوشت، ہاتھ سے پسے ہوئے خالص مصالحے اور تیز آنچ پر لوہے کی کڑاہی استعمال کرتے ہیں۔ کوئی مصنوعی رنگ یا کیمیکل شامل نہیں کیا جاتا۔',
    aboutFeature1: 'کوئلے پر تازہ باربی کیو',
    aboutFeature1Desc: 'قدرتی لکڑی کے کوئلے پر آہستہ آہستہ پکا ہوا رسیلا اور خستہ باربی کیو۔',
    aboutFeature2: 'مٹی کے تندور کی گرما گرم روٹیاں',
    aboutFeature2Desc: 'روغنی، کلونجی، گارلک اور سادے نان جو آرڈر ملتے ہی تازہ لگائے جاتے ہیں۔',
    aboutFeature3: 'صاف ستھرا خاندانی ماحول',
    aboutFeature3Desc: 'اعلیٰ صفائی، ایئر کنڈیشنڈ فیملی ہال اور گرم خانوں میں تیز ترین ہوم ڈیلیوری۔',
    
    contactTag: 'براہِ راست آرڈر اور معلومات',
    contactTitle: 'رابطہ اور تیز رفتار ڈیلیوری',
    contactDescription: 'ہماری ویب سائٹ پر آرڈر کریں، فون پر بات کریں یا واٹس ایپ پر پیغام بھیجیں۔',
    deliveryHelpline: 'ڈیلیوری ہیلپ لائن',
    deliveryHelplineDesc: 'فوری ہوم ڈیلیوری، پارسل اور کھانوں کی تفصیل کے لیے ہمہ وقت دستیاب۔',
    orderOnWhatsapp: 'واٹس ایپ پر آرڈر کریں',
    restaurantLocation: 'ریسٹورنٹ کا پتہ',
    restaurantLocationDesc: 'آرام دہ فیملی ڈائننگ، ایئر کنڈیشنڈ ہال اور لائیو باربی کیو اسٹیشن۔',
    getDirections: 'راستہ معلوم کریں (گوگل میپس)',
    deliveryHoursTitle: 'ڈیلیوری اور کھلے رہنے کے اوقات',
    deliveryHoursDesc: 'پورے شہر میں آپ کی دہلیز تک گرما گرم کھانا۔',
    estimatedDeliveryTime: 'ڈیلیوری کا تخمینہ وقت',
    
    cartTitle: 'آپ کا آرڈر',
    itemsSelected: 'کھانے منتخب کیے گئے',
    cartEmpty: 'آپ کا کارٹ خالی ہے۔ براہ کرم کھانے منتخب کریں۔',
    proceedToCheckout: 'واٹس ایپ پر آرڈر کریں',
    proceedToWhatsappOrder: 'واٹس ایپ پر آرڈر کریں',
    whatsappOrderTitle: 'واٹس ایپ ڈیلیوری آرڈر',
    whatsappOrderSubtitle: 'کراچی میں آپ کی دہلیز تک گرما گرم کھانا (کیش آن ڈیلیوری)',
    sendOrderViaWhatsapp: 'آرڈر واٹس ایپ پر بھیجیں',
    orderSentTitle: 'آرڈر واٹس ایپ پر بھیج دیا گیا!',
    orderSentDesc: 'آپ کے آرڈر کی تفصیلات واٹس ایپ پر لوڈ ہو چکی ہیں۔ براہ کرم واٹس ایپ میں Send کا بٹن دبا کر آرڈر مکمل کریں۔',
    reopenWhatsapp: 'دوبارہ واٹس ایپ چیٹ کھولیں',
    orderMoreFood: 'مزید کھانے آرڈر کریں',
    deliveryInfoTitle: 'ڈیلیوری کی معلومات',
    fullName: 'پورا نام',
    phoneNumber: 'فون / موبائل نمبر',
    phoneLabel: 'آپ کا واٹس ایپ / موبائل نمبر',
    phoneHelp: 'یہ آرڈر آپ کے لاگ اِن واٹس ایپ سے سروان کے واٹس ایپ پر جائے گا۔',
    deliveryAddress: 'گھر کا مکمل پتہ',
    addressHelp: 'مکان نمبر، گلی / بلاک، قریبی نشانی، علاقہ (کراچی)',
    whatsappNotice: 'فارم بھرنے کے بعد آپ کا نام، واٹس ایپ نمبر، اور ڈیلیوری ایڈریس خود بخود آپ کے لاگ اِن واٹس ایپ سے سروان کے واٹس ایپ (0335-3131686) پر چلا جائے گا۔',
    specialInstructions: 'کھانے کے بارے میں خاص ہدایات (اختیاری)',
    confirmOrder: 'واٹس ایپ پر آرڈر بھیجیں',
    directToWhatsapp: 'واٹس ایپ پر بھیجیں',
    orOrderDirectlyViaWhatsapp: 'براہِ راست واٹس ایپ آرڈر',
    totalPayable: 'وصولی کے وقت واجب الادا رقم',
    deliveryFee: 'معیاری ڈیلیوری چارجز',
    copyOrderText: 'آرڈر ٹیکسٹ کاپی کریں',
    copiedToClipboard: 'آرڈر ٹیکسٹ کاپی ہو گیا!',
    
    footerAbout: 'اصلی کوئلہ باربی کیو، مٹن و چکن شنواری کڑاہی، ہانڈی اور روغنی نان۔ صفائی اور حلال معیار پر کوئی سمجھوتہ نہیں۔',
    quickNav: 'اہم لنکس',
    timingDelivery: 'اوقات اور ڈیلیوری',
    contactLocation: 'رابطہ و پتہ',
    allRightsReserved: 'جملہ حقوق محفوظ ہیں۔ سروان باربی کیو اینڈ فاسٹ فوڈ۔'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isUrdu: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'sarawan_preferred_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (saved === 'ur' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  const isUrdu = language === 'ur';
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isUrdu }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
